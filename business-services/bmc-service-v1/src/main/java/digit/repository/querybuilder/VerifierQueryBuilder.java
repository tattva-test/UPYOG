package digit.repository.querybuilder;

import java.util.List;

import org.springframework.stereotype.Component;
import org.springframework.util.ObjectUtils;

import digit.web.models.SchemeApplicationSearchCriteria;

@Component
public class VerifierQueryBuilder {

/*     private static final String BASE_QUERY = """

                select eb.applicationnumber ,eb.userid ,eb.tenantid,
                bs.name as scheme
            """;
    private static final String EMPLOYEE_WARD_QUERY = """

               select ebe.ward from eg_bmc_employeewardmapper where
            """;

    private static final String FROM_TABLES = """
            FROM eg_bmc_userschemeapplication eb
            LEFT JOIN eg_wf_processinstance_v2 wf on wf.businessid = eb.applicationnumber
            LEFT JOIN eg_bmc_aadharuser eba ON eb.userid = eba.userid AND eb.tenantid = eba.tenantid
            LEFT JOIN eg_bmc_schemes bs ON eb.optedid = bs.id
            LEFT JOIN eg_bmc_schememachine ebs ON eb.optedid = ebs.schemeid
            LEFT JOIN eg_bmc_machines ebm ON ebs.machineid = ebm.id
            LEFT JOIN eg_bmc_schemecourse ebs2 ON eb.optedid = ebs2.schemeid
            LEFT JOIN eg_bmc_courses bc ON ebs2.courseid = bc.id
            LEFT JOIN eg_bmc_userotherdetails uod ON  eb.userid = uod.userid AND eb.tenantid = uod.tenantid
            """;

    private static final String BASE_GROUP_BY = """
             GROUP BY eb.applicationnumber,eb.userid ,eb.tenantid,bs.name
            """;
    private static final String MACHINE_GROUP_BY = """
            ,machine
            """;

    private static final String COURSE_GROUP_BY = """
            ,course
            """;

    public String getVerificationSearchQuery(SchemeApplicationSearchCriteria criteria, List<Object> preparedStmtList) {
        StringBuilder query = new StringBuilder(BASE_QUERY);
        if (ObjectUtils.isEmpty(criteria.getMachineId())) {
            query.append(", array_agg(ebm.name) as machine ");
        } else {
            query.append(", ebm.name as machine ");
        }
        if (ObjectUtils.isEmpty(criteria.getCourseId())) {
            query.append(", array_agg(bc.coursename) as course ");
        } else {
            query.append(" ,bc.coursename as course ");
        }
        query.append(FROM_TABLES);

        if (!ObjectUtils.isEmpty(criteria.getCourseId())) {
            addClauseIfRequired(query, preparedStmtList);
            query.append(" ebs2.courseId = ?");
            preparedStmtList.add(criteria.getCourseId());

        }
        if (!ObjectUtils.isEmpty(criteria.getMachineId())) {
            addClauseIfRequired(query, preparedStmtList);
            query.append(" ebs.machineid = ? ");
            preparedStmtList.add(criteria.getMachineId());
        }
        if (!ObjectUtils.isEmpty(criteria.getSchemeId())) {
            addClauseIfRequired(query, preparedStmtList);
            query.append(" bs.id = ? ");
            preparedStmtList.add(criteria.getSchemeId());
        }
        //commented due to eg_bmc_employeewardmapper table is empty_
        // if (!ObjectUtils.isEmpty(criteria.getUuid())) {
        //     addClauseIfRequired(query, preparedStmtList);
        //     query.append(" uod.ward = (select ebe.ward from eg_bmc_employeewardmapper where ebe.uuid = ?) ");
        //     preparedStmtList.add(criteria.getUuid());
        // }
        if(!ObjectUtils.isEmpty(criteria.getState()))
        {
           
           if(criteria.getState().equalsIgnoreCase("verify")  ||
               criteria.getState().equalsIgnoreCase("randomize") ||
               criteria.getState().equalsIgnoreCase("approv")) {
            
                addClauseIfRequired(query, preparedStmtList); 
                query.append("wf.action = ? ");
                preparedStmtList.add(criteria.getState().toUpperCase());
               }
           
        }
        addClauseIfRequired(query, preparedStmtList);
        // query.append("ud.available = true ");
        query.append(" eb.verificationstatus != true AND eb.applicationstatus = true ");
        query.append(BASE_GROUP_BY);

        if (!ObjectUtils.isEmpty(criteria.getMachineId())) {
            query.append(MACHINE_GROUP_BY);
        }
        if (!ObjectUtils.isEmpty(criteria.getCourseId())) {
            query.append(COURSE_GROUP_BY);
        }

        return query.toString();
    }


    private void addClauseIfRequired(StringBuilder query, List<Object> preparedStmtList) {
        if (preparedStmtList.isEmpty()) {
            query.append(" WHERE ");
        } else {
            query.append(" AND ");
        }
    }*/

}
