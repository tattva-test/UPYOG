package digit.repository;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

import digit.repository.querybuilder.SchemeDetailQueryBuilder;
import digit.repository.rowmapper.SchemeRowMapper;
import digit.repository.rowmapper.SchemeWiseApplicationCountRowmapper;
import digit.web.models.scheme.EventDetails;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Repository
public class SchemesRepository {

    @Autowired
    private SchemeDetailQueryBuilder queryBuilder;

    @Autowired
    private JdbcTemplate jdbcTemplate;

    @Autowired
    private SchemeRowMapper rowMapper;

    @Autowired
    private SchemeWiseApplicationCountRowmapper countRowmapper;

    public List<EventDetails> getSchemeDetails(SchemeSearchCriteria searchCriteria) {
        List<Object> preparedStmtList = new ArrayList<>();
        String query = queryBuilder.getSchemeSearchQuery(searchCriteria, preparedStmtList);
        log.info("Final query: " + query);
        return jdbcTemplate.query(query, rowMapper, preparedStmtList.toArray());
    }

    public List<EventDetails> getSchemeWiseCounts(SchemeSearchCriteria searchCriteria) {
        List<String> actions = searchCriteria.getAction();
        if (actions == null || actions.isEmpty()) {
            return new ArrayList<>();
        }
        String sql;
        if(actions.contains("APPLY")){
         sql =  "select * from schemecounts_for_verify where  uuid = ?"; 
         return jdbcTemplate.query(sql, countRowmapper, searchCriteria.getUuid());  
        }else{
         sql = "select * from schemecounts where action in (%s)";
          String inClause = actions.stream()
                .map(a -> "?")
                .collect(Collectors.joining(","));

        sql = String.format(sql, inClause);
        log.info("Final query: " + sql);
        return jdbcTemplate.query(sql, countRowmapper, actions.toArray());
        }
    }

}
