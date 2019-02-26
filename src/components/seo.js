import React from 'react'
import PropTypes from 'prop-types'
import Helmet from 'react-helmet'
import { StaticQuery, graphql } from 'gatsby'

function SEO({ description, lang }) {
  return (
    <StaticQuery
      query={detailsQuery}
      render={data => {
        const { name, title, description, keywords } = data.site.siteMetadata
        return (
          <Helmet
            htmlAttributes={{
              lang,
            }}
            title={name}
            titleTemplate={`%s | ${title}`}
            meta={[
              { name: `description`, content: description },
              { property: `og:title`, content: name },
              { property: `og:description`, content: description },
              { property: `og:type`, content: `website` },
              { name: `twitter:card`, content: `summary` },
              { name: `twitter:title`, content: name },
              { name: `twitter:description`, content: description },
              // keywords defined as props to the SEO component
              { name: `keywords`, content: keywords },
              // Prevent the index.html from being cached, to trigger an immediate update
              {
                'http-equiv': 'cache-control',
                content: 'no-cache, must-revalidate, post-check=0, pre-check=0',
              },
              { 'http-equiv': 'cache-control', content: 'max-age=0' },
              { 'http-equiv': 'expires', content: '0' },
              {
                'http-equiv': 'expires',
                content: 'Tue, 01 Jan 1980 1:00:00 GMT',
              },
              { 'http-equiv': 'pragma', content: 'no-cache' },
            ]}
          />
        )
      }}
    />
  )
}

SEO.defaultProps = {
  lang: `en`,
}

SEO.propTypes = {
  lang: PropTypes.string,
}

export default SEO

const detailsQuery = graphql`
  query DefaultSEOQuery {
    site {
      siteMetadata {
        title
        description
      }
    }
  }
`
