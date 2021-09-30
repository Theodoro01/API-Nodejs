const express = require("express");
const authMiddlewares = require("../middlewares/auth.js");

const Project = require("../models/project");
const Task = require("../models/task");

const router = express.Router();

router.use(authMiddlewares);



router.get( "/" , async ( req, res ) => {
    try {
        const projects = await Project.find().populate( [ "user", "tasks" ] );

        return res.send({ projects });

    } catch ( err ) {
        return res.status(400).send( { error: "Error loading project" } );
    }
});



router.get( "/:projectId" , async ( req, res ) => {

    try {
        const project = await Project.findById( req.params.projectId ).populate( [ "user", "tasks" ] );

        return res.send({ project });

    } catch ( err ) {

        return res.status(400).send( { error: "Error loading project" } ); 

    }
});



router.post( "/" , async ( req, res ) => {
    try {
        const {title, decription, tasks} = req.body;

        const project = await Project.create({ title, decription, user: req.userId});

        await Promise.all(tasks.map(async task => {
            const projectTask = new Task({...task, project: project._id  });

            await projectTask.Save();
            
            project.tasks.push(projectTask);

        }));

        await project.save();

        return res.send({ project });

    } catch ( err ) {
        console.log(err);
        return res.status(400).send( { error: "Error creating new project" } );
    }
});



router.put( "/:projectId" , async ( req, res ) => {
    try {
        const {title, decription, tasks} = req.body;

        const project = await Project.findByIdAndUpdate(req.params.projectId, { 
            title, 
            decription, 
            }, { new: true });
        
            project.tasks = [];
            await Task.remove({ project: project._id });

        await Promise.all(tasks.map(async task => {
            const projectTask = new Task({ ...task , project: project._id  });

            await projectTask.Save();
            
            project.tasks.push( projectTask );

        }));

        await project.save();

        return res.send({ project });

    } catch ( err ) {
        return res.status(400).send( { error: "Error creating new project" } );
    }
});

router.delete( "/:projectId" , async ( req, res ) => {
    try {
        const project = await Project.findByIdAndRemove( req.params.projectId );

        return res.send();

    } catch ( err ) {

        return res.status(400).send( { error: "Error deleting project" } ); 

    }
});


module.exports = app => app.use("/projects", router);