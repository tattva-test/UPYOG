package org.egov.egf.masters.repository;

import java.util.List;

import org.egov.egf.masters.model.PropertyTaxDemandRegister;
import org.egov.egf.masters.model.PropertyTaxReceiptRegister;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.google.common.base.Optional;

@Repository
public interface PropertyTaxReceiptRegisterRepository extends JpaRepository<PropertyTaxReceiptRegister,Long>{
	
	List<PropertyTaxReceiptRegister> findAll();
	
    //Optional<PropertyTaxReceiptRegister> findByPropertyid(String propertyId);
    List<PropertyTaxReceiptRegister> findByPropertyid(String propertyId);



}
