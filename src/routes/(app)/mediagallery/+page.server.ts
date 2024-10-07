/**
 * @file src/routes/(app)/mediagallery/+page.server.ts
 * @description Server-side logic for the media gallery page.
 *
 * This module handles:
 * - Fetching media files from various collections (images, documents, audio, video)
 * - Fetching virtual folders
 * - File upload processing for different media types
 * - Error handling and logging
 *
 * The load function prepares data for the media gallery, including user information,
 * a list of all media files, and virtual folders. The actions object defines the
 * server-side logic for handling file uploads.
 */
import { publicEnv } from '@root/config/public';

import { error } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import { saveImage, saveDocument, saveAudio, saveVideo } from '@src/utils/media/mediaProcessing';
import { constructUrl } from '@src/utils/media/mediaUtils';

// Auth
import { dbAdapter } from '@src/databases/db';

// System Logs
import { logger } from '@src/utils/logger';

// Helper function to convert _id and other nested objects to string
function convertIdToString(obj: any): any {
	const stack: any[] = [{ parent: null, key: '', value: obj }];
	const seen = new WeakSet();
	const root = Array.isArray(obj) ? [] : {};

	while (stack.length) {
		const { parent, key, value } = stack.pop();

		// If value is not an object, assign directly
		if (value === null || typeof value !== 'object') {
			if (parent) parent[key] = value;
			continue;
		}

		// Handle circular references
		if (seen.has(value)) {
			if (parent) parent[key] = value;
			continue;
		}
		seen.add(value);

		// Initialize object or array
		const result = Array.isArray(value) ? [] : {};
		if (parent) parent[key] = result;

		// Process each key/value pair or array element
		for (const k in value) {
			if (value[k] === null) {
				result[k] = null;
			} else if (k === '_id' || k === 'parent') {
				result[k] = value[k]?.toString() || null; // Convert _id or parent to string
			} else if (Buffer.isBuffer(value[k])) {
				result[k] = value[k].toString('hex'); // Convert Buffer to hex string
			} else if (typeof value[k] === 'object') {
				// Add object to the stack for further processing
				stack.push({ parent: result, key: k, value: value[k] });
			} else {
				result[k] = value[k]; // Assign primitive values
			}
		}
	}

	return root;
}

export const load: PageServerLoad = async ({ locals }) => {
	if (!dbAdapter) {
		logger.error('Database adapter is not initialized');
		throw error(500, 'Internal Server Error');
	}

	try {
		const user = locals.user;
		if (!user) {
			logger.warn('No user found in locals, redirecting to login');
			throw redirect(302, '/login');
		}

		// Convert user._id to a string to ensure it's serializable
		const serializedUser = convertIdToString(user);
		const folderIdentifier = publicEnv.MEDIA_FOLDER;

		// Fetch media files
		const media_types = ['media_images', 'media_documents', 'media_audio', 'media_videos', 'media_remote'];
		const media_promises = media_types.map((type) => {
			const query = type === 'media_remote' ? { folder: folderIdentifier } : {};
			return dbAdapter && dbAdapter.findMany(type, query);
		});

		let results = await Promise.all(media_promises);
		results = results.map(
			(arr, index) =>
				arr &&
				arr.map((item) =>
					convertIdToString({
						...item,
						type: media_types[index].split('_')[1],
						url: constructUrl('global', item.hash, item.name, item.name.split('.').pop(), media_types[index]),
						thumbnailUrl: constructUrl('global', item.hash, `${item.name}-thumbnail`, item.name.split('.').pop(), media_types[index])
					})
				)
		);

		const media = results.flat();

		// Fetch virtual folders
		const virtualFolders = await dbAdapter.getVirtualFolders();
		const serializedVirtualFolders = virtualFolders.map((folder) => convertIdToString(folder));

		logger.info(`Fetched ${serializedVirtualFolders.length} virtual folders`);

		logger.debug('Media gallery data and virtual folders loaded successfully');
		const returnData = { user: serializedUser, media, virtualFolders: serializedVirtualFolders };

		// Added Debugging: Log the returnData
		logger.debug('Returning data from load function:', returnData);

		return returnData;
	} catch (err) {
		const message = `Error in media gallery load function: ${err instanceof Error ? err.message : String(err)}`;
		logger.error(message);
		throw error(500, message);
	}
};

export const actions: Actions = {
	
	// Default action for file upload
   default: async ({ request, cookies }) => {
	   const session_id = cookies.get(SESSION_COOKIE_NAME);
	   if (!session_id) {
		   logger.warn('No session ID found during file upload, redirecting to login');
		   throw redirect(302, '/login');
	   }

	   if (!auth || !dbAdapter) {
		   logger.error('Authentication system or database adapter is not initialized');
		   throw error(500, 'Internal Server Error');
	   }

	   try {
		   const user = await auth.validateSession({ session_id });
		   if (!user) {
			   logger.warn('Invalid session during file upload, redirecting to login');
			   throw redirect(302, '/login');
		   }

		   const formData = await request.formData();
		   const files = formData.getAll('files');

		   // Map of file types to their respective save functions
		   const save_media_file = {
			   application: saveDocument,
			   audio: saveAudio,
			   font: saveDocument,
			   example: saveDocument,
			   image: saveImage,
			   message: saveDocument,
			   model: saveDocument,
			   multipart: saveDocument,
			   text: saveDocument,
			   video: saveVideo
		   };

		   for (const file of files) {
			   if (file instanceof File) {
				   const [type] = file.type.split('/') as [keyof typeof save_media_file];
				   if (type in save_media_file) {
					   const { fileInfo } = await save_media_file[type](file, collection_names[type], user._id);
					   await dbAdapter.insertMany(collection_names[type], [{ ...fileInfo, user: user._id }]);
					   logger.info(`File uploaded successfully: ${file.name}`);
				   } else {
					   logger.warn(`Unsupported file type: ${file.type}`);
				   }
			   }
		   }

		   return { success: true };
	   } catch (err) {
		   logger.error('Error during file upload:', err instanceof Error ? err.message : String(err));
		   return { success: false, error: 'File upload failed' };
	   }
   },


	// Action to delete a media file
	deleteMedia: async ({ request }) => {
        try {
            const { image } = await request.json();
            logger.info('Received delete request for image:', image);

            if (!image?._id) {
                logger.error('Invalid image data received');
                throw error(400, 'Invalid image data received');
            }

            if (!dbAdapter) {
                logger.error('Database adapter is not initialized.');
                throw error(500, 'Internal Server Error');
            }

            logger.info(`Deleting image: ${image._id}`);
            const success = await dbAdapter.deleteMedia(image._id.toString());

            if (success) {
                logger.info('Image deleted successfully');
                return { success: true };
            } else {
                throw error(500, 'Failed to delete image');
            }
        } catch (err) {
            logger.error('Error deleting image:', err instanceof Error ? err.message : String(err));
            throw error(500, 'Internal Server Error');
        }
};
