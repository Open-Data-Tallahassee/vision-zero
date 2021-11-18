const config = require('./config/meta');
const {createHttpLink} = require("apollo-link-http");
const fetch = require("isomorphic-fetch");

module.exports = {
  siteMetadata: {
    title: config.siteTitle,
    description: config.siteDescription,
    author: config.schema.author,
    mapboxToken: `pk.eyJ1IjoicGFzaWgiLCJhIjoiY2pybzJqdTVjMHJzeDQ0bW80aGdzaXV3ayJ9.yxD8Nqu7FLnf8-lBo7F1zQ`
  },
  flags: {
    FAST_DEV: true,
  },
  plugins: [
    `gatsby-plugin-react-helmet`,
    // {
    //   resolve: 'gatsby-source-graphql',
    //   options: {
    //     // arbitrary name for the remote schema query type
    //     typeName: 'MongoDB', 
    //     // field under which the remote schema will be accessible. will be used in the gatsby query
    //     fieldName: 'allMongodbRegions',
    //     // create Apollo Link manually. can return a Promise.
    //     createLink: () => 
    //       createHttpLink({
    //         uri: 'https://us-west-2.aws.realm.mongodb.com/api/client/v2.0/app/climate-cabinet-production-esyps/graphql',
    //           headers: {
    //             apiKey: `qsyikbBilDOKsU3WbyyrFXaKWjf2crgqoKqacrz47UeZl7GOEj8PiQ7d7nxXvRny`
    //           },
    //           fetch,
    //       })
    //   }
    // },
    // {
    //   resolve: `gatsby-plugin-styled-components`,
    //   options: {
    //     displayName: process.env.NODE_ENV !== `production`,
    //     fileName: false,
    //   },
    // }
  ],
}