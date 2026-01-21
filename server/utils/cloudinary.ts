 import {v2 as cloudinary} from 'cloudinary'
 import dotenv from 'dotenv';

 dotenv.config({path: 'config/.env.local'})

 cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
 })

 export const uploadSingleImage = async (image: string, folder_name: string) => {
    const result = await cloudinary.uploader.upload(image, {folder: folder_name})

    return {
        image_url: result.secure_url,
        public_id: result.public_id
    }
 }

 export const uploadMultipleImages = async (images: string[], folder_name: string) => {
   const promises = images.map((img)=> uploadSingleImage( img, folder_name))

   return Promise.all(promises)
 }

 export const deleteImage = async (image_public_id: string) => {
    const response = await cloudinary.uploader.destroy(image_public_id)

    return response?.result === 'ok'
 }