import React from 'react'

import Layout from '../components/layout'
import SEO from '../components/seo'

import Home from '../components/home/home'
import Supports from '../components/supports/supports'
import Problems from '../components/problems/problems'
import Solutions from '../components/solutions/solutions'
import Community from '../components/community/community'
import Footer from '../components/footer/footer'

const IndexPage = () => (
  <Layout>
    <SEO />
    <Home />
    <Problems />
    <Solutions />
    {/* <Community /> */}
    <Footer />
    <Supports />
  </Layout>
)

export default IndexPage
