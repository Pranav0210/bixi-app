const Ev = require('../models/model.ev')
const { imgUpload } = require('../util/aws-controller')

const getEv = async (req,res)=>{
    // console.log(req.body.user_details)
    if(Object.entries(req.body.ev_details).length > 0){
        const ev = await Ev.findOne({ev_regd : req.body.ev_details.ev_regd})
        if(ev)
        res.status(200).send(`Ev Details : ${ev}`)
        else
        res.status(404).send(`Vehicle doesn't exist.`)
    }
    else 
        res.status(404).send('Query empty!')
}
const saveEv = async(req,res)=>{
    try{
    //     var findResult = await Ev.findOne({ev_regd:req.body.query_field.ev_regd}).exec();
    //     console.log(findResult instanceof Ev, findResult)
    //     if(findResult){
    //         findResult = {... findResult, ...req.body.update_fields}
    //         await findResult.save();
    //         res.status(204).send(`Ev details updated successfully.`)
    //     }
    //     else{
    //         // if(req.files){
    //         //     const imgPath = req.files.path[0]
    //         //     const blob = fs.readFileSync(imgPath)
    //         //     const imgUrl = await imgUpload(blob) 
    //         // }
    //         const newEv = new Ev({...req.body.update_fields})
    //         // if(imgUrl){
    //         //     newEv.image = imgUrl
    //         // }
    //         await newEv.save();
    //         res.status(201).send(`Ev created`)
    //     }
    // }
    // catch(err){
    //     res.send(`error: ${err}`)
    // }
    const options = {upsert:true,setDefaultsOnInsert:true,new:true}
        if(!req.body.update_fields && !req.files){
            res.send('No data. Update failed.')
        }
        await Ev.findOneAndUpdate(req.body.query_field,req.body.update_fields, options)
        .then((result)=>{
            console.log(`Ev updated successfully:${result}`)
        })
        if(req.files &&  req.files.length > 0){
            var imgUrls = []
            req.files.forEach(async(img,index) => {
                const imgPath = img.path
                const blob = fs.readFileSync(imgPath)
                imgUrls[index] = await imgUpload(blob) 
            })
            await Ev.findOneAndUpdate(req.body.query_field,{ image : imgUrls[0]}, options )
            .then((result)=>{
                console.log(`Ev image updated successfully: ${result}`)
            })
        }
        res.status(201).send(`Ev updated successfully`)
        
        // else{
        //     }
        //     const newUser = new User({...req.body.update_fields, img : imgUrls[0], document_img : imgUrls[1]})
        //     await newUser.save();
        //     res.status(201).send(`user created`)
        // }
    }
    catch(err){
        res.send(`error: ${err}`)
    }
}
const evQuery = async (req,res)=>{
    const queryResult = await Ev.find(req.body.query_fields)
    res.status(200).send(queryResult);
}
const deleteEv = async(req,res)=>{
    const deletedCount = await Ev.deleteOne({...req.body.query_field.contact})
    res.send(`Deleted ${deletedCount} Ev profile`)
}

module.exports = {getEv,saveEv,evQuery,deleteEv}