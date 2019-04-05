export function styles() {
    return /* css */ `
.header {
    position: relative;
}
`;
}
export function render() {
    return `I’m a frontend developer/engineer with about {now.getFullYear() -
        CAREER_START} years of experience in building web applications.

    I’m an active proponent of Modern JavaScript, CSS3 and HTML5. I love building application agnostic plugins/components using aforementioned technologies. I also like working on backend server using PHP and NodeJS.

    My personal development projects include an application agnostic right-click menu (context menu) using React.js and a syntax highlighter for NodeJS.

    ### Work Experience

    **Flipkart Internet Pvt. Ltd., Bengaluru, India.**

    *UI Engineer II - July 2017 – present*

    *UI Engineer - June 2016 – June 2017*
    <br>
      - Worked on the desktop & mobile sites of Flipkart.com
      - Technology evangelist for web platform

    **Helical IT Solutions Pvt. Ltd., Hyderabad, India.**

    *Lead Frontend Developer - Mar 2014 – May 2016*
    <br>
      - Developed company product (a data analysis tool) using Backbone.js and React.js.
      - Promoted to lead developer within 6 months.

    **Freelance Frontend Web Developer, Hyderabad, India.**

    *Aug 2013 - March 2014*
    <br>
      - Worked with people from around the world.
      - Developed websites/applications based on the customer requirement

    <div class="page-break"></div>

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
      - Building applications/components using **React.js**.
      - Testing with **Jest**, **Jasmine**, **Mocha/Chai** and **Karma**.
      - Build tools like **Gulp** and **Webpack**.
      - Strong Typing with


    **HTML5 and CSS3:**
      - Experience with frameworks like **Bootstrap** and **Foundation**
      - Knowledge of **Responsive web design** with exposure to **mobile first development**

    **PHP:**
     - Experience with frameworks like **Laravel/Lumen** and **Slim**.
     - Knowledge of **Test Driven Development** with exposure to **PHPUnit** and **PHPSpec**.

    **Others:**
     - Version control: **Git**.
     - Familiar with databases like **MySQL**, **SQLite** and **MongoDB**.
     - Familiar with **Apache** and **Nginx** servers and **\*nix** environments.
     - Can work on any OS: **Windows**, **Mac OS X** and **Ubuntu**.

     <div class="page-break"></div>

    ### Open source and community</h3>
    I’m an active participant on GitHub.

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
}
