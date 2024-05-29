package org.egov.egf.masters.repository;

import java.util.List;

import org.egov.egf.masters.model.PropertyTaxModuleCodesMappingWithCoa;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface PropertyTaxModuleCodesMappingWithCoaRepository extends JpaRepository<PropertyTaxModuleCodesMappingWithCoa, Long> {

   PropertyTaxModuleCodesMappingWithCoa findById(Long id);

}
