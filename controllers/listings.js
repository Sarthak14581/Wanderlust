const Listing = require("../models/listing");


module.exports.index = async (req, res, next) => {
    const allListings = await Listing.find({});
    res.render("listings/index.ejs", { allListings });
}


module.exports.renderNewForm = async (req, res, next) => {
    res.render("listings/new.ejs");
}

     
module.exports.showListing = async (req, res, next) => {
    let { id } = req.params;
    const listing = await Listing.findById(id).populate({path: "reviews", populate: {path: "author"}}).populate("owner");   
    if(!listing) {
        req.flash("error", "Listing you requested for does not exist!");
        res.redirect("/listings");    
    }
    console.log(listing);
    res.render("listings/show.ejs", { listing });
}


module.exports.createListing = async (req, res, next) => {   
    let url = req.file.path;
    let filename = req.file.filename;
    
    const { listing } = req.body;

    // Set the image field explicitly as an object with a URL and filename
    // if (!listing.image || !listing.image.url) {
    //     // Use default image if none is provided
    //     listing.image = {
    //         url: "https://images.unsplash.com/photo-1590523278191-995cbcda646b?ixlib=rb-1.2.1&q=80&fm=jpg&crop=entropy&cs=tinysrgb&w=1080&fit=max&ixid=eyJhcHBfaWQiOjEyMDd9",
    //         filename: "default_image.jpg"
    //     };
    // }
    
    const newListing = new Listing(listing);
    newListing.owner = req.user._id;
    newListing.image = {url, filename};
    await newListing.save();
    req.flash("success", "New Listing Created");    
    res.redirect("/listings");

    }


    module.exports.renderEditForm = async (req, res, next) => {
        let { id } = req.params;
        const listing = await Listing.findById(id); 
        if(!listing) {
            req.flash("error", "Listing you requested for does not exist!");
            res.redirect("/listings");    
        }
        let originalImageUrl = listing.image.url;
        originalImageUrl = originalImageUrl.replace("/upload", "/upload/w_250")
        res.render("listings/edit.ejs", { listing, originalImageUrl});
    }


    module.exports.updateListing = async (req, res) => {
        
        let { id } = req.params;
        
        let listing = await Listing.findByIdAndUpdate(id, { ...req.body.listing });

        if(typeof req.file !== "undefined") {
            let url = req.file.path;
            let filename = req.file.filename;
            listing.image = {url, filename};
            await listing.save();   
        }
       
        req.flash("success", "Listing Updated!");    
    
        res.redirect(`/listings/${id}`);
    }



    module.exports.destroyListing = async (req, res) => {
        let {id} = req.params;
        await Listing.findByIdAndDelete(id);
        req.flash("success", "Listing Deleted");    
        res.redirect("/listings");
    }