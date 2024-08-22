const cloudinary = require('cloudinary');

cloudinary.config({
    cloud_name:"dl0q94vc8",
    api_key:"623724511254665",
    api_secret:"AH8JAUXlrt_8dxuytcj8hqRak9M",


});

const ControladorSubirImagen = async(req, res)=>{

    
    try{
        const resultado = await cloudinary.uploader.upload(req.files.image.path);
        res.json({
            url:resultado.secure_url,
            public_id:resultado.public_id,

        });
    } catch (error){
        console.log(error);
    }
};
module.exports = {ControladorSubirImagen};