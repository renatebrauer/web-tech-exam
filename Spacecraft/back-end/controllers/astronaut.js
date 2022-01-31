const AstronautDB=require('../models').Astronaut;

const express = require("express");

const roles = ["COMMANDER","PILOT","GENERAL"];

const controller = {
    addAstronaut: async (req,res) => {
        const astronaut = {
            name:req.body.name,
            role:req.body.role
        }
        let err=false;
        if(astronaut.name.length<=5) {
            res.status(400).send({message:"Name must be at least 5 characters long"})
            err=true;
        }
        if(astronaut.role!=="COMMANDER" && astronaut.role!=="PILOT" && astronaut.role!=="GENERAL") {
            res.status(400).send({message:"Role must be from the list"});
            err=true;
        }
        if(!err) {
            try {
                const newAstronaut=await AstronautDB.create(astronaut);
                res.status(200).send("Astronaut added");
            }
            catch (error) {
                console.log('Error:',error);
                res.status(500).send("Error creating new astronaut!");
            }
        }
    },
    getAllAstronauts: async(req,res) => {
        try {
            let astronauts=await AstronautDB.findAll();
            res.status(200).send(astronauts);
        } catch(err){
            res.status(500).send({
                message: "Error selecting all astronauts!"
            })
        }
    },
    getOneAstronaut: async(req, res) => {
        try{
            let astronautId = req.params['id'];
            const astronaut = await AstronautDB.findOne({ where : { id: astronautId }});
            res.status(200).send(astronaut);
        } catch(err){
            res.status(500).send({
                message: "Error selecting astronaut!"
            })
        }
    },

    updateAstronaut: async(req,res) => {
        let astronautId=req.params['id'];
        const astronaut=await AstronautDB.findOne({where:{id:astronautId}});
        astronaut.update({
            name:req.body.name,
            role:req.body.role
        })
            .then(() => {
                res.status(200).send({message:"Edited astronaut"})
            })
            .catch(() => {
                res.status(500).send({message:"Error"})
            })
    },
    deleteAstronaut : async(req,res) => {
        try{
            let astronautId = req.params['id'];
            const astronaut = await AstronautDB.destroy({
                where: {
                    id: astronautId
                }
            })
            res.status(200).send({
                message: "astronaut " + astronautId + " deleted."
            });
        }catch(error){
            res.status(500).send({
                message: "Error deleting astronaut!"
            })
        }
    }
}

module.exports = controller;