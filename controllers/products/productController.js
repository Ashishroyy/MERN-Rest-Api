import multer from "multer";
import path from "path";
import Products from "../../models/products.js";
import CustomErrorHandler from '../../services/CustomErrorHandler.js';
// import productSchema from "../../vaildater/productVaildater.js";


const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, 'uploads/'),
    filename:(req, file, cb) => {

        const uniqueName = `${Date.now()}-${Math.round(Math.random()* 1e9)}${path.extname(file.originalname)}`;
        cb(null, uniqueName)
    },
});

const handleMultipartData = multer({storage, limits: {filesize: 1000000 * 5},}).single('image');//

const productController ={
    async store(req, res, next) {
        // Multipart form data

        
        handleMultipartData(req, res, async(err) => {
            if (err) {
                return next(CustomErrorHandler.serverError(err.message));
            }
         let filePath = req.file.path

        
        //  const { error } = ProductSchema.validate(req.body);
        //  if (error) {
        //      // Delete the uploaded file
        //      fs.unlink(`${appRoot}/${filePath}`, (err) => {
        //          if (err) {
        //              return next(
        //                  CustomErrorHandler.serverError(err.message)
        //              );
        //          }
        //      });

        //      return next(error);
        //  }
         const { name, price, size } = req.body;
         let document;
         try {
             document = await Products.create({
                 name,
                 price,
                 size,
                 image: filePath
             })
         } catch (err) {
             return next(err);
         }

         res.status(201).json(document);

        });
    },
    
    update( req, res ,next ){
        handleMultipartData(req, res, async(err)=>{
            if(err){
               return next(CustomErrorHandler.serverError(err.message))
            }
           let filePath;
            if(req.file){
            filePath = req.file.path;
            }
            // validation
        //    const {error} = ProductSchema.validate(req.body);
        //    if(error){
        //        //delete upload file
        //        if(req.file){

        //            fs.unlink(`${appRoot}/${filePath}` , (err)=>{
        //                if(err){
        //            return next(CustomErrorHandler.serverError(err.message)
        //            );
    
        //                }
        //            });
        //        }

            //    return next(error)
        //    }

           const {name, price ,size} = req.body;
           let document;

           try{
               document = await Products.findOneAndUpdate({ _id: req.params.id },
                {
                   name,
                   price,
                   size,
                   ...(req.file && {image: filePath}),
                   
               },{ new: true });

           }catch(err){
               return next(err);
           }
            res.status(201).json(document);
    })
  },

  async destroy(req, res ,next){

    const document = await Products.findByIdAndRemove({_id: req.params.id});
    if(!document){
        return next(new Error('nothing to delete'))
    }
    // delete
    const imagePath = document._doc.image;
    // fs.unlink(`${appRoot}/${imagePath}`, (err)=> {
    //     if(err) {
    //         return next(CustomErrorHandler.serverError());
    //     }
        return res.json(document)
    // });

    },
    async allProducts(req ,res ,next){
        let documents;
        try{
        documents = await Products.find().select('-updatedAt -__v').sort({_id: -1});
        }catch(err){
            return next(CustomErrorHandler.serverError());
        }
        return res.json(documents)
    },
    async singleProduct(req ,res ,next){
        let document;
        try{
            document = await Products.findOne({_id: req.params.id}).select('-updatedAt -__v');

        }catch(err){
            return next(CustomErrorHandler.serverError());
        }
    return res.json(document);
    },

    async getProduct(req, res,next){
        let documents;
        try{
            documents = await Products.find({
                _id: { $in: req.body.ids },
            }).select('-updatedAt -__v');
        }catch(err){
            return next(CustomErrorHandler.serverError());
        }
        return res.json(documents);
    },
};

    

export default productController;