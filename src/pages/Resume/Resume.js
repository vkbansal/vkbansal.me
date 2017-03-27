import React from 'react';

import Page from 'src/components/Page';
import Markdown from 'src/components/Markdown';

import settings from 'settings.yml';

const social = new Map(settings.social);

const resume = `
### Profile

I’m a frontend developer with about two years of experience in building applications with Backbone.js and React.js Frameworks.

I’m an active proponent of Modern JavaScript, CSS3 and HTML5. I love building application agnostic plugins/components using aforementioned technologies. I also like working on backend server using PHP and NodeJS.

My personal development projects include an application agnostic right-click menu (context menu) using React.js and Flux architecture; and a syntax highlighter for NodeJS.

### Work Experience

**UI Engineer**
*June 2016 – present* <!--{.right}-->
<br>Flipkart
  - Working on the desktop site of Flipkart.com

**Lead Frontend Developer**
*Mar 2014 – May 2016* <!--{.right}-->
<br>Helical IT Solutions Pvt. Ltd.

  - Developed company product (a data analysis tool) using Backbone.js and React.js.
  - Promoted to lead developer within 6 months.

**Freelance Frontend Web Developer**
*Aug 2013 - Present* <!--{.right}-->
<br>http://vkbansal.me/

  - Worked with people from around the world.
  - Developed websites/applications based on the customer requirement


### Education
**Indian Institute of Technology Indore (IIT Indore)**
*2013* <!--{.right}-->
<br>Bachelor of Technology (B. Tech) in Mechanical Engineering, GPA: 6.44.

**Sri Chaitanya Junior College, Hyderabad**
*2009*<!--{.right}-->
<br>Class XII: 88.1%, Board of Intermediate Education, Andhra Pradesh, India


### Certifications
**Machine Learning (Coursera)**
<br/>Instructor: Andrew Ng.
<br/>License: UXKQ8Z78PYU2

### Technical Skills
**JavaScript:**
  - Building applications/components using **Backbone.js** and **React.js**.
  - Testing with **Jasmine**, **Mocha/Chai** and **Karma**.
  - Plugin creation using **jQuery**.
  - Build tools like **Gulp** and **Webpack**.


**HTML5 and CSS3:**
  - Experience with frameworks like **Bootstrap** and **Foundation**
  - Knowledge of **Responsive web design** with exposure to **mobile first development**

**PHP:**
 - Experience with frameworks like **Laravel/Lumen** and **Slim**.
 - Knowledge of **Test Driven Development** with exposure to **PHPUnit** and **PHPSpec**.

**Others:**
 - Version control: **Git**.
 - Pretty good with **Photoshop** and **Illustrator**.
 - Familiar with databases like **MySQL**, **SQLite** and **MongoDB**.
 - Familiar with **Apache** and **Nginx** servers and **\*nix** environments.
 - Can work on any OS: **Windows**, **Mac OS X** and **Ubuntu**.

### Open source and community</h3>
I’m an active participant on GitHub. I maintain ES5 Examples for ReactDnD and provide active feedback on development of NVM for Windows.

**Major Contributions:**
  - **Prism.js (Syntax Highlighter)**
    - Provided definitions JSX (React) and TypeScript.
    - Provided 'highlight-keywords' plugin.

  - **Node Notifier (by @mikaelbr)**
    - Added support for Windows 8+ Toast Notifications.
    - Released in v3.2.0.

**My projects:**
  - **React Context-menu (JS):** Context menu implemented in React.
  - **Illuminate (JS):** A syntax highlighter based on prism.js ported for NodeJS and React.
  - **Gulp Group Files (JS):** A gulp plugin for grouping files via an object for further processing.
  - **Gulp Edit XML (JS):** A gulp plugin for editing xml files, especially SVG files.
  - **Front-Matter (PHP):** Allows page-specific variables to be included at the top of a template using the YAML, JSON or INI format.
`;

export default function About(props) {
    return (
        <Page {...props}>
            <div className='container'>
                <h1 className='title'>Vivek Kumar Bansal</h1>
                <h2 className='subtitle'>Frontend-Developer</h2>
                <Markdown>
                    {resume}
                </Markdown>
            </div>
        </Page>
    );
}

/**
<!--{section#intro}-->

- [:navicon-email: ~Email~ ~{{data.site.author.email}}~](mailto:{{ data.site.author.email }})
- [:navicon-mobile: ~Mobile~ ~+91-9676635890~](#)
- [:navicon-link: ~Website~ ~{{data.site.base_url|replace("https://", "")|replace("/", "")}}~]({{data.site.base_url}})
- [:navicon-github: ~Github~ ~{{data.social.github.link|replace("https://", "")}}~]({{data.social.github.link}})
- [:navicon-twitter: ~Twitter~ ~@{{data.social.twitter.username}}~]({{data.social.twitter.link}})
<!--{ul:.profile-links}-->

 */
