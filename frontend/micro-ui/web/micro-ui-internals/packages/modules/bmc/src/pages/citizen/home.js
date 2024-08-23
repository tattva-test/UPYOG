import React from "react";
import { Link, useRouteMatch } from 'react-router-dom'
import { LinkButton } from '@upyog/digit-ui-react-components'
import { useTranslation } from "react-i18next";
const Home = () => {
    const { path, url, ...match } = useRouteMatch();
    const { t } = useTranslation();
    return (
        <React.Fragment>
            <div className="full-width-card" Style="padding:0px 10px 0px 10px;">
                <div className="BMC_Top" Style="width:96%;">Welcome to BMC's Welfare Schemes</div>
                <div>
                    <p Style="padding: 10px 0px 10px 8px">Current Schemes And Their Eligibility Critaria</p>
                    <ul Style="list-style:square;padding: 0px 10px 0px 25px">
                        <li><b><u>Women Empowerment</u></b>
                            <ol Style="list-style-type: upper-roman;list-style-position: outside;padding: 0px 10px 5px 25px">
                                <li>You should be women</li>
                                <li>Your Age should be between 18-60 years</li>
                                <li>Not taken this benifit in last 10 years</li>
                            </ol>
                        </li>
                        <li><b><u>Women Skill Development</u></b>
                            <ol Style="list-style-type: upper-roman;list-style-position: outside;padding: 0px 10px 5px 25px">
                                <li>You should be women</li>
                                <li>Your Age should be between 18-60 years</li>
                                <li>Not taken this benifit in last 10 years</li>
                            </ol>
                        </li>
                        <li><b><u>Digyang Skill Development</u></b>
                            <ol Style="list-style-type: upper-roman;list-style-position: outside;padding: 0px 10px 5px 25px">
                                <li>You should be women</li>
                                <li>Your Age should be between 18-60 years</li>
                                <li>Not taken this benifit in last 10 years</li>
                            </ol>
                        </li>
                        <li><b><u>Digyang Pension</u></b>
                            <ol Style="list-style-type: upper-roman;list-style-position: outside;padding: 0px 10px 5px 25px">
                                <li>You should be women</li>
                                <li>Your Age should be between 18-60 years</li>
                                <li>Not taken this benifit in last 10 years</li>
                            </ol>
                        </li>
                    </ul>
                </div>
            </div>
            <div className="full-width-card" Style="padding:0px 10px 0px 10px;">
                <div className="BMC_Bottom" Style="width:96%;">
                    <Link to={`${path}/application/create`}>
                        <LinkButton label={t("Next")} />
                    </Link>
                </div>
            </div>
        </React.Fragment>
    )
}
export default Home;
