import React from 'react';
import {Helmet} from 'react-helmet';
const metadata = ({title}) => {
  return (
    <div>
           <Helmet>
                <title>{title}</title>
                <meta name="description" content="My page description" />

           </Helmet>
    </div>
  );
} 

export default metadata;
