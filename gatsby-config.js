module.exports = {
  siteMetadata: {
    name: 'DAppNode',
    title: `Your personal node for the decentralized web`,
    description: `DAppNode connects the decentralized internet by allowing a user to conveniently host P2P clients. Run your own node today, and begin enabling censorship free web traffic.`,
    keywords: `gatsby, application, react`,
  },
  plugins: [
    `gatsby-plugin-offline`,
    `gatsby-plugin-react-helmet`,
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        name: `images`,
        path: `${__dirname}/src/images`,
      },
    },
    `gatsby-transformer-sharp`,
    `gatsby-plugin-sharp`, //fix this
    {
      resolve: `gatsby-plugin-manifest`,
      options: {
        name: `DAppNode website`,
        short_name: `starter`,
        start_url: `/`,
        background_color: `#663399`,
        theme_color: `#663399`,
        display: `minimal-ui`,
        icon: `src/images/favicon.png`,
      },
    },
    {
      resolve: 'gatsby-plugin-google-fonts',
      options: {
        fonts: [`Poppins\:300,400,500,700,9000`],
      },
    },
  ],
}
