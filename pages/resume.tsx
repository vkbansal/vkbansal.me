import cx from 'classnames';
import { formatDistance } from 'date-fns';

import { useStyles } from '../scripts/useStyles';
import { html } from '../scripts/html';

const CAREER_START = new Date(2013, 7);
export async function render() {
    const styles = await useStyles(resumeStyles);
    const now = new Date();

    return (
        <div class={cx('container', styles['resume'])}>
            <section>
                <h1>Vivek Kumar Bansal</h1>
                <p>
                    I’m a frontend developer/engineer with {formatDistance(now, CAREER_START)} of
                    experience in building web applications.
                </p>
                <p>
                    I’m an active proponent of Modern JavaScript, CSS3 and HTML5. I love building
                    application agnostic plugins/components using aforementioned technologies. I
                    also like working on backend server using PHP and NodeJS.
                </p>
            </section>
            <section id="work-experience">
                <h3>Work Experience</h3>
                <div class={styles['experience']}>
                    <h4>Flipkart Internet Pvt. Ltd. Bengaluru, India.</h4>
                    <p class={styles['position']}>
                        <span class={styles['company']}>UI Engineer II</span>
                        <span class={styles['date']}>July 2017 – present</span>
                    </p>
                    <p class={styles['position']}>
                        <span class={styles['company']}>UI Engineer</span>
                        <span class={styles['date']}>June 2016 – June 2017</span>
                    </p>
                    <ul>
                        <li>Worked on the desktop & mobile sites of Flipkart.com</li>
                        <li>Technology evangelist for web platform</li>
                    </ul>
                </div>
                <div class={styles['experience']}>
                    <h4>Helical IT Solutions Pvt. Ltd., Hyderabad, India.</h4>
                    <p class={styles['position']}>
                        <span class={styles['company']}>Lead Frontend Developer</span>
                        <span class={styles['date']}>Mar 2014 – May 2016</span>
                    </p>
                    <ul>
                        <li>
                            Built the company product (a data analysis tool) from scratch using{' '}
                            <code>Backbone.js</code> and <code>React.js</code>.
                        </li>
                        <li>Promoted to lead developer within 6 months.</li>
                    </ul>
                </div>
                <div class={styles['experience']}>
                    <h4>Freelance Frontend Web Developer, Hyderabad, India.</h4>
                    <p class={styles['position']}>
                        <span class={styles['company']}>Freelance</span>
                        <span class={styles['date']}>Aug 2013 - March 2014</span>
                    </p>
                    <ul>
                        <li>Worked with people from around the world.</li>
                        <li>Developed websites/applications based on the customer requirement.</li>
                    </ul>
                </div>
            </section>
            <section id="technical-skills">
                <h3>Technical Skills</h3>
                <div class={styles['experience']}>
                    <ul>
                        <li>JavaScript/TypeScript</li>
                    </ul>
                    {
                        // ### Technical Skills
                        // **JavaScript:**
                        //   - Building applications/components using **React.js**.
                        //   - Testing with **Jest**, **Jasmine**, **Mocha/Chai** and **Karma**.
                        //   - Build tools like **Gulp** and **Webpack**.
                        //   - Strong Typing with
                        // **HTML5 and CSS3:**
                        //   - Experience with frameworks like **Bootstrap** and **Foundation**
                        //   - Knowledge of **Responsive web design** with exposure to **mobile first development**
                        // **PHP:**
                        //  - Experience with frameworks like **Laravel/Lumen** and **Slim**.
                        //  - Knowledge of **Test Driven Development** with exposure to **PHPUnit** and **PHPSpec**.
                        // **Others:**
                        //  - Version control: **Git**.
                        //  - Familiar with databases like **MySQL**, **SQLite** and **MongoDB**.
                        //  - Familiar with **Apache** and **Nginx** servers and **\*nix** environments.
                        //  - Can work on any OS: **Windows**, **Mac OS X** and **Ubuntu**.
                    }
                </div>
            </section>
            <div class={styles['page-break']} />
            <section id="education">
                <h3>Education</h3>
                <div class={styles['experience']}>
                    <h4>Indian Institute of Technology, Indore (IIT Indore), India.</h4>
                    <p class={styles['position']}>
                        <span class={styles['company']}>
                            Bachelor of Technology (B. Tech) in Mechanical Engineering.
                        </span>
                        <span class={styles['date']}>2009 - 2013</span>
                    </p>
                </div>
            </section>
            <section id="certifications">
                <h3>Certifications</h3>
                <div class={styles['experience']}>
                    <h4>Machine Learning (Coursera)</h4>
                    <p>
                        Instructor: Andrew Ng. <br /> License: UXKQ8Z78PYU2
                    </p>
                </div>
            </section>
        </div>
    );

    // ### Open source and community</h3>
    // I’m an active participant on GitHub.

    // **Major Contributions:**
    //   - **Prism.js (Syntax Highlighter)**
    //     - Provided definitions JSX (React) and TypeScript.
    //     - Provided 'highlight-keywords' plugin.

    //   - **Node Notifier (by @mikaelbr)**
    //     - Added support for Windows 8+ Toast Notifications.
    //     - Released in v3.2.0.

    // **My projects:**
    //   - **React Context-menu (JS):** Context menu implemented in React.
    //   - **Illuminate (JS):** A syntax highlighter based on prism.js ported for NodeJS and React.
    //   - **Gulp Group Files (JS):** A gulp plugin for grouping files via an object for further processing.
    //   - **Gulp Edit XML (JS):** A gulp plugin for editing xml files, especially SVG files.
    //   - **Front-Matter (PHP):** Allows page-specific variables to be included at the top of a template using the YAML, JSON or INI format.
    // `;
}

export const resumeStyles = `
.resume {
    @media print {
        font-size: 12px;
    }

    .experience {
        margin-bottom: 30px;

        & h4 {
            margin-bottom: 8px;
        }

        & ul {
            margin-bottom: 0;
        }
    }

    .position {
        display: grid;
        grid-template-columns: [company] 1fr [date] 1fr;
        font-style: italic;
        margin-bottom: 8px;
    }

    .company {
        grid-column: company;
    }

    .date {
        grid-column: date;
        text-align: right;
    }
}

.page-break {
    @media all {
        display: none;
    }

    @media print {
        display: block;
        page-break-before: always;
    }
}
`;
