import React from 'react'
import {AdvancedImage} from '@cloudinary/react';
import {Cloudinary} from "@cloudinary/url-gen";
import { thumbnail } from '@cloudinary/url-gen/actions/resize';
import { focusOn } from '@cloudinary/url-gen/qualifiers/gravity';
import { face } from "@cloudinary/url-gen/qualifiers/focusOn";
import { lazyload, placeholder } from '@cloudinary/react';



const Img = ({uploadedImg}) => {
  const cld = new Cloudinary({                // Create a Cloudinary instance and set your cloud name
      cloud: { cloudName: 'dr25ejygj' }
  });
  
  const myImage = cld.image(uploadedImg);     // cld.image returns a CloudinaryImage with the configuration set.

  // resize
  myImage.resize(thumbnail().width(150).height(150).gravity(focusOn(face())))

  return (
    <div>
        <AdvancedImage cldImg={myImage} plugins={[lazyload(), placeholder({mode: 'predominant-color'})]} />
    </div>
  )

}
export default Img;

// npm i @cloudinary/url-gen @cloudinary/react

