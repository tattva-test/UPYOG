package org.egov.egf.masters.model;

import java.io.Serializable;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.Table;

@Entity
@Table(name = "property_tax_module_codes_mapping_with_coa")
public class PropertyTaxModuleCodesMappingWithCoa implements Serializable{

	
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    @Column(name = "id")
    private Long id;

    @Column(name = "glcode", nullable = false)
    private String glcode;

    @Column(name = "name")
    private String name;

    @Column(name = "accounthead")
    private String accounthead;

    @Column(name = "propertytype")
    private String propertytype;

    @Column(name = "propertytypecode")
    private String propertytypecode;

    @Column(name = "usage")
    private String usage;

    @Column(name = "glcodeid")
    private Long glcodeid;

    @Column(name = "propertytypeaccounthead")
    private String propertytypeaccounthead;

    @Column(name = "propertytypecodeid")
    private Long propertytypecodeid;

    // Getters and setters

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getGlcode() {
        return glcode;
    }

    public void setGlcode(String glcode) {
        this.glcode = glcode;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getAccounthead() {
        return accounthead;
    }

    public void setAccounthead(String accounthead) {
        this.accounthead = accounthead;
    }

    public String getPropertytype() {
        return propertytype;
    }

    public void setPropertytype(String propertytype) {
        this.propertytype = propertytype;
    }

    public String getPropertytypecode() {
        return propertytypecode;
    }

    public void setPropertytypecode(String propertytypecode) {
        this.propertytypecode = propertytypecode;
    }

    public String getUsage() {
        return usage;
    }

    public void setUsage(String usage) {
        this.usage = usage;
    }

    public Long getGlcodeid() {
        return glcodeid;
    }

    public void setGlcodeid(Long glcodeid) {
        this.glcodeid = glcodeid;
    }

    public String getPropertytypeaccounthead() {
        return propertytypeaccounthead;
    }

    public void setPropertytypeaccounthead(String propertytypeaccounthead) {
        this.propertytypeaccounthead = propertytypeaccounthead;
    }

    public Long getPropertytypecodeid() {
        return propertytypecodeid;
    }

    public void setPropertytypecodeid(Long propertytypecodeid) {
        this.propertytypecodeid = propertytypecodeid;
    }
}
