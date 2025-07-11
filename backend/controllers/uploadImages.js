import fs from 'fs';
import path from 'path'



import Resume from '../models/resumeModel.js';
import upload from '../middleware/uploadMiddleware.js'; 


export const uploadResumeImages = async (req, res) => {

    try {

        // Configure multer to handle images 


        upload.fields ([{name : "thumbnail"}, {name : "profileImage"}])(req, res, async (err) => {
            if (err) {  
                return res.status(400).json({ message : "File upload failed" , error: error.message });
            }

            const resumeId = req.params.id;
            const resume = await Resume.findOne ({_id : resumeId , userId : req.user._id})


            if(!resume){
                return res.status(404).json({message : "Resume not found or unauthorized" })
            }


            //Use process cwd to locate uploads folder 

            const uploadFolder = path.join(process.cwd(), 'uploads');

            const baseUrl = `${req.protocol}://${req.get('host')}`;


            const newThumbnail = req.files.thumbnail?.[0];
            const newProfileImage = req.files.profileImage?.[0];

            if(newThumbnail){
                if(resume.thumbnailLink) {
                    const oldThumbnail = path.join(uploadFolder, path.basenameresume.thumbnailLink);
                    if(fs.existsSync(oldThumbnail)) {
                        fs.unlinkSync(oldThumbnail);
                    }
                }resume.thumbnailLink = `${baseUrl}/uploads/${newThumbnail.filename}`;
            }




            //Same for ProfileView Image

            if(newProfileImage) {
                if(resume.profileInfo?.profilePreviewUrl) {
                    const oldProfile = path.join(uploadsFolder, path.basename(resume.profileInfo.profilePreviewUrl));
                    if(fs.existsSync(oldProfile)) {
                        fs.unlinkSync(oldProfile);
                    }
                }
                    resume.profileInfo.profilePreviewUrl = `${baseUrl}/uploads/${newThumbnail.filename}`;
                }
    
                // Save the updated resume
                await resume.save();
    
                res.status(200).json({ message: "Images uploaded successfully", thumbnail: resume.thumbnailLink, profilePreviewUrl: resume.profileInfo.profilePreviewUrl });
            });
        } catch (error) {
            res.status(500).json({ message: "Internal server error", error: error.message });
        }
    };