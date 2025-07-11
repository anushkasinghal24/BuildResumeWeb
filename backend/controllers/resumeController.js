import Resume from '../models/resumeModel.js';
import fs from 'fs';
import path from 'path';


export const createResume = async (req, res) => {
    try {
        const {title} = req.body;


        //Default Template

        const defaultResumeData = {
            profileInfo: {
                profileImg: null,
                previewUrl: '',
                fullName: '',
                designation: '',
                summary: '',
            },
            contactInfo: {
                email: '',
                phone: '',
                location: '',
                linkedin: '',
                github: '',
                website: '',
            },
            workExperience: [
                {
                    
                    company: '',
                    role: '',
                    startDate: '',
                    endDate: '',
                    description: '',
                },
            ],
            education: [
                {
                
                    degree: '',
                    institution: '',
                    startDate: '',
                    endDate: '',
                },
            ],
            skills: [
                {
                    name: '',
                    progress: 0,
                },
            ],
            projects: [
                {
                    title: '',
                    description: '',
                    github: '',
                    liveDemo: '',
                },
            ],
            certifications: [
                {
                    title: '',
                    issuer: '',
                    year: '',
                },
            ],
            languages: [
                {
                    name: '',
                    progress: '',
                },
            ],
            interests: [''],
        };

        const newResume = await Resume.create({
            userId: req.user._id,
            title,
            ...defaultResumeData,
            ...req.body

        })

        res.status(201).json({
            success: true,
            message: 'Resume created successfully',
            resume: newResume,
        });


    } catch (error) {

        res.status(500).json({
            success: false,
            message: 'Failed to create resume',
            error: error.message,
        });

    }
}




//Get function 

export const getUserResumes = async (req, res) => {
    try{
        const resumes = await Resume.find({userId : req.user._id}).sort
        ({UpdatedAt: -1});
        res.json(resumes);
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Failed to retrieve resumes',
            error: error.message,
        });
    }
}


//Get Resume by ID function


export const getResumeById = async (req, res) => {
    try {
        const resume = await Resume.findOne({ _id: req.params.id, userId: req.user._id });

        if (!resume) {
            return res.status(404).json({
                success: false,
                message: 'Resume not found',
            });
        }

        if (resume.userId.toString() !== req.user._id.toString()) {
            return res.status(403).json({
                success: false,
                message: 'Not authorized to access this resume',
            });
        }

        res.json(resume);
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Failed to retrieve resume',
            error: error.message,
        });
    }
}


//Update Resume function

export const updateResume = async (req, res) => {
    try{
        const resume = await Resume.findOne(
            { _id: req.params.id, userId: req.user._id }
        );

        if(!resume) {
            return res.status(404).json({
                success: false,
                message: 'Resume not found',
            });
        }

        //Merge Updates resume 

        Object.assign(resume, req.body);
        
        const savedResume = await resume.save();
        res.json({
            success: true,
            message: 'Resume updated successfully',
            resume: savedResume,
        });

    } 
    catch (error) {
    res.status(500).json({
        success: false,
        message: 'Failed to update resume',
        error: error.message,
    });

    }

}


//DElete Resume function

export const deleteResume = async (req, res) => {
    try{
        const resume = await Resume.findOne({
            _id: req.params.id,
            userId: req.user._id
        });
        if(!resume) {
            return res.status(404).json({
                success: false,
                message: 'Resume not found',
            });     

        }

        //Create  a uploads folder and store the resume there
         const uploadsFolder = path.join(process.cwd(), 'uploads');


         //Dele thumbnail Function

         if(resume.thumbnailLink){
            const oldThumbnail = path.join(uploadsFolder, resume.thumbnailLink);
            if(fs.existsSync(oldThumbnail)) {
                fs.unlinkSync(oldThumbnail);
            }
         }

         if(resume.profileInfo?.previewUrl) {
            const oldPreview = path.join(uploadsFolder, path.basename(resume.profileInfo.previewUrl));
            if(fs.existsSync(oldPreview)) {
                fs.unlinkSync(oldPreview);
            }
         }

         //Delete the resume Document 


         const deleted = await Resume.deleteOne({
            _id: req.params.id,
            userId: req.user._id
        });
        if (deleted.deletedCount === 0) {
            return res.status(404).json({
                success: false,
                message: 'Resume not found',
            });
        }

        res.json({
            success: true,
            message: 'Resume deleted successfully',
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Failed to delete resume',
            error: error.message,
        });
        }
    }

    
        
        
    
