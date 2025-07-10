 import mongoose from "mongoose";

const resumeSchema = new mongoose.Schema({
    userId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    title: {
        type: String,
        required: true
    },
    thumbnailLink:{
        type: String,
        
    },
    template:{
        theme: String,
        colorPalette : [String]

    },

    profileInfo : {
        profilePreviewUrl : String, 
        fullName : String , 
        designation : String ,
        summary: String,

    },

    contactInfo : {
        email: String,
        phone: String,
        address: String,
        website: String,
        socialLinks: {
            linkedin: String,
            github: String,
            twitter: String
        }
    },

    workExperience: [{
        jobTitle: String,
        companyName: String,
        location: String,
        startDate: Date,
        endDate: Date,
        description: String
    }],

    education: [{
        degree: String,
        institution: String,
        startDate: Date,
        endDate: Date,
        description: String
    }],

    skills: [
        {
            name : String,
            progress : String , 


        }
    ],

    projects: [
        {
            title: String,
            description: String,
            githublink: String,
            startDate: Date,
            endDate: Date
        }
    ],

    certifications : [
        {
            title: String,
            issuer: String,
            year : String
            
        }
    ],

    languages : [{

        name: String,
        progress : Number,
    }],

    interests: [String],



}


, {
    timestamps: { createdAt: true, updatedAt: true }
});

const Resume = mongoose.model("Resume", resumeSchema);
export default Resume;
// This schema defines the structure of a resume document in MongoDB.