package digit.repository.rowmapper;

import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

import digit.web.models.security.AnimalType;
import org.springframework.dao.DataAccessException;
import org.springframework.jdbc.core.ResultSetExtractor;
import org.springframework.stereotype.Component;

import digit.web.models.common.CommonDetails;
@Component
public class CommonRowMapper implements ResultSetExtractor<List<CommonDetails>>{
    @Override
    public List<CommonDetails> extractData(ResultSet rs) throws SQLException, DataAccessException {
        Map<Long, CommonDetails> commonDetailsMap = new LinkedHashMap<>();
        while (rs.next()) {
            Long commonID = rs.getLong("id");
            CommonDetails commonDetails = commonDetailsMap.get(commonID);
            if (commonDetails == null) {
                commonDetails = CommonDetails.builder()
                        .name(rs.getString("name")) 
                        .id(rs.getLong("id"))        
                        .licenceNumber(rs.getString("licencenumber")) 
                        .animalType(new ArrayList<>())
                        .build();
                    }
                commonDetailsMap.put(commonID, commonDetails);
                AnimalType animalType = AnimalType.builder().id(rs.getInt("animalId")) 
                        .name(rs.getString("animalType")).build(); 
                commonDetails.getAnimalType().add(animalType);
           
        }

        return new ArrayList<>(commonDetailsMap.values());
    }
}
