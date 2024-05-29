package org.egov.egf.masters.services;

import java.math.BigInteger;
import java.time.LocalDate;
import java.time.ZoneId;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.Calendar;
import java.util.Date;
import java.util.List;
import java.util.Optional;

import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;

import org.egov.commons.CChartOfAccounts;
import org.egov.commons.CFiscalPeriod;
import org.egov.commons.CGeneralLedger;
import org.egov.commons.CVoucherHeader;
import org.egov.commons.Fund;
import org.egov.commons.Vouchermis;
import org.egov.commons.dao.FiscalPeriodHibernateDAO;
import org.egov.commons.repository.CChartOfAccountsRepository;
import org.egov.commons.repository.CGeneralLedgerRepository;
import org.egov.commons.repository.CVoucherHeaderRepository;
import org.egov.commons.repository.FundRepository;
import org.egov.commons.repository.VouchermisRepository;
import org.egov.commons.service.EntityTypeService;
import org.egov.commons.utils.EntityType;
import org.egov.egf.masters.model.PropertyTaxModuleCodesMappingWithCoa;
import org.egov.egf.masters.model.PropertyTaxReceiptRegister;
import org.egov.egf.masters.repository.PropertyTaxDemandRegisterRepository;
import org.egov.egf.masters.repository.PropertyTaxModuleCodesMappingWithCoaRepository;
import org.egov.egf.masters.repository.PropertyTaxReceiptRegisterRepository;
import org.egov.infra.validation.exception.ValidationException;
import org.egov.infstr.services.PersistenceService;
import org.egov.services.voucher.VoucherHeaderService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional
public class PropertyTaxReceiptRegisterService implements EntityTypeService{
	
	@Autowired
    @Qualifier("persistenceService")
    private PersistenceService persistenceService;
	
	@Autowired
	private CChartOfAccountsRepository chartOfAccountsRepository;
	@Autowired
	private PropertyTaxDemandRegisterRepository propertyTaxDemandRegisterRepository;
	@Autowired
	private VoucherHeaderService voucherHeaderService;
	@Autowired
	private FundRepository fundRepository;
	
	@Autowired
	private CVoucherHeaderRepository cvoucherHeaderRepository;
	
	@Autowired
	private VouchermisRepository vouchermisRepository;
	@Autowired
	private CGeneralLedgerRepository cgeneralLedgerRepository;
	
	@Autowired
    private FiscalPeriodHibernateDAO fphd;

    
    @PersistenceContext
    private EntityManager entityManager; 
    @Autowired
    private PropertyTaxReceiptRegisterRepository propertyTaxReceiptRegisterRepository;
    
   
    @Autowired
    private PropertyTaxModuleCodesMappingWithCoaRepository ptmc;
    
    
    public Optional<CVoucherHeader> getDetailsForMaxIdFromVoucherHeader() {
        return cvoucherHeaderRepository.getDetailsForMaxIdFromVoucherHeader();
    }
 /*   public List<PropertyTaxReceiptRegister> getAlllDatas(PropertyTaxReceiptRegister pt){
    	List<PropertyTaxReceiptRegister> propertyTaxReceiptRegister = propertyTaxReceiptRegisterRepository.findAll();
    	
    	 List<CVoucherHeader> voucherHeaders = cvoucherHeaderRepository.findAll();
         List<Vouchermis> vouList = vouchermisRepository.findAll();
         List<CGeneralLedger> cg = cgeneralLedgerRepository.findAll();
         
         Optional<CVoucherHeader> cvhh = getDetailsForMaxIdFromVoucherHeader();
         System.out.println(cvhh);
         Long  nextId = cvhh.get().getId()+1;
         String sqlQuery1 = "SELECT COALESCE(MAX(id), 0) FROM voucherheader";
		    BigInteger maxVcId = (BigInteger) entityManager.createNativeQuery(sqlQuery1).getSingleResult();
		    maxVcId = maxVcId.add(BigInteger.ONE);
         
         LocalDate currentDates = LocalDate.now();
         String currentMonth = String.format("%02d", currentDates.getMonthValue()); 
         String currentFinancialYear = currentDates.format(DateTimeFormatter.ofPattern("2024-25")); 
         String newVoucherNumber = String.format("1/RJV/%08d/%s/%s", nextId, currentMonth, currentFinancialYear);
         System.out.println(newVoucherNumber);
         
         int startNumber = 1000000000 + maxVcId.intValue(); // Update startNumber based on nextId
         String formattedId = String.format("%09d", startNumber+nextId);
         String cgvn = "1/JVG/CGVN" + formattedId;
         System.out.println(cgvn);     
         Date currentDateAndTime = new Date();

         Calendar calendar = Calendar.getInstance();
         calendar.setTime(currentDateAndTime);
         calendar.set(Calendar.HOUR_OF_DAY, 0);
         calendar.set(Calendar.MINUTE, 0);
         calendar.set(Calendar.SECOND, 0);
         calendar.set(Calendar.MILLISECOND, 0);
         Date currentDate = calendar.getTime();
         
         CFiscalPeriod cp = fphd.getFiscalPeriodByDate(currentDate);
         Long fid = cp.getId();
         
         	CVoucherHeader cVoucherHeader = new CVoucherHeader();
         	Fund fund = getFundById(1);
         	cVoucherHeader.setId(108L);
         	cVoucherHeader.setName("JVGeneral");
         	cVoucherHeader.setType("Journal Voucher");
         	cVoucherHeader.setDescription("null");
         	cVoucherHeader.setEffectiveDate(new Date());
         	cVoucherHeader.setVoucherNumber(newVoucherNumber);
         	cVoucherHeader.setVoucherDate(currentDate);
         	cVoucherHeader.setFundId(fund);
         	cVoucherHeader.setFiscalPeriodId(fid.intValue());
         	cVoucherHeader.setStatus(0);
         	cVoucherHeader.setOriginalvcId(null);
         	cVoucherHeader.setIsConfirmed(null);
        	cVoucherHeader.setCreatedBy(251L);
         	cVoucherHeader.setRefvhId(null);
         	cVoucherHeader.setCgvn(cgvn);
         	cVoucherHeader.setLastModifiedBy(251L);
         	cVoucherHeader.setLastModifiedDate(new Date());
         	cVoucherHeader.setModuleId(null);
        	cVoucherHeader.setCreatedDate(new Date());
    //     	cVoucherHeader.setVersion(1L);
      //   	voucherHeaderService.save(cVoucherHeader);
         	CVoucherHeader savedCVoucherHeader = voucherHeaderService.save(cVoucherHeader);

         	System.out.println(savedCVoucherHeader.getId());
         	Vouchermis vouchermis = new Vouchermis();
         	CVoucherHeader cv = savedCVoucherHeader;
//         	vouchermis.setId(61L);
         	vouchermis.setBillnumber(null);
         	vouchermis.setDivisionid(null);
         	vouchermis.setDepartmentcode("DEPT_13");
         	vouchermis.setVoucherheaderid(cv);
         	vouchermis.setFundsource(null);
         	vouchermis.setSchemeid(null);
         	vouchermis.setSubschemeid(null);
         	vouchermis.setFunctionary(null);
         	vouchermis.setSourcePath(null);
         	vouchermis.setBudgetaryAppnumber(null);
         	vouchermis.setBudgetCheckReq(null);
         	vouchermis.setFunction(null);
         	vouchermis.setReferenceDocument(null);
         	vouchermis.setServiceName(null);
         	
         	voucherHeaderService.save(vouchermis);
         	System.out.println(vouchermis);
         	if(pt.getFlag()==0) {
                Long voucherId = cv.getId(); 
                 pt.setVoucherid(voucherId);
             propertyTaxReceiptRegisterRepository.save(pt);
      }

       
         	PropertyTaxModuleCodesMappingWithCoa ptcr = ptmc.findById(1L);
         	PropertyTaxModuleCodesMappingWithCoa ptPenalty = ptmc.findById(7L);
         	PropertyTaxModuleCodesMappingWithCoa ptIntrest = ptmc.findById(8L);

            List<CGeneralLedger> cgeneralLedger = new ArrayList<>();
            CChartOfAccounts coa = getById(1167L);
            CChartOfAccounts coa2 = getById(1123L);
            CChartOfAccounts intrestHead = getById(1255L);
            CChartOfAccounts penaltyHead =	getById(414L);
            CGeneralLedger entry1 = new CGeneralLedger();
            entry1.setVoucherlineId(1);
            entry1.setEffectiveDate(new Date());
            entry1.setGlcodeId(coa);
            entry1.setGlcode("4502101");
            entry1.setDebitAmount(Double.parseDouble(pt.getTotalcollection().replaceAll(",", "")));
            entry1.setCreditAmount(0.00);
            entry1.setDescription(null);
            entry1.setVoucherHeaderId(cv);
            
            Double intrest = Double.parseDouble(pt.getInterest());
            Double penalty = Double.parseDouble(pt.getPenalty());
           if(intrest >0 || penalty >0) {
            if(intrest >0 && penalty >0) {
           	 CGeneralLedger entry2 = new CGeneralLedger();
                entry2.setVoucherlineId(2);
                entry2.setEffectiveDate(new Date());
                entry2.setGlcodeId(intrestHead);
                entry2.setGlcode(ptIntrest.getGlcode());
                entry2.setDebitAmount(0.00);
                entry2.setCreditAmount(intrest);
                entry2.setDescription(null);
                entry2.setVoucherHeaderId(cv); 
                
                CGeneralLedger entry3 = new CGeneralLedger();
                entry3.setVoucherlineId(3);
                entry3.setEffectiveDate(new Date());
                entry3.setGlcodeId(penaltyHead);
                entry3.setGlcode(ptPenalty.getGlcode());
                entry3.setDebitAmount(0.00);
                entry3.setCreditAmount(penalty);
                entry3.setDescription(null);
                entry3.setVoucherHeaderId(cv);
                
                CGeneralLedger entry4 = new CGeneralLedger();
                entry4.setVoucherlineId(4);
                entry4.setEffectiveDate(new Date());
                entry4.setGlcodeId(coa2);
                entry4.setGlcode(ptcr.getPropertytypecode());
                entry4.setDebitAmount(0.00);
                entry4.setCreditAmount(Double.parseDouble(pt.getTotalcollection().replaceAll(",", "")));
                entry4.setDescription(null);
                entry4.setVoucherHeaderId(cv);
                cgeneralLedger.add(entry1);
                cgeneralLedger.add(entry2);
                cgeneralLedger.add(entry3);
                cgeneralLedger.add(entry4);
                voucherHeaderService.save(cgeneralLedger);
            }
            else if(intrest > 0 && penalty <= 0) {
           	 CGeneralLedger entry2 = new CGeneralLedger();
                entry2.setVoucherlineId(2);
                entry2.setEffectiveDate(new Date());
                entry2.setGlcodeId(intrestHead);
                entry2.setGlcode(ptIntrest.getGlcode());
                entry2.setDebitAmount(0.00);
                entry2.setCreditAmount(intrest);
                entry2.setDescription(null);
                entry2.setVoucherHeaderId(cv);
                
                CGeneralLedger entry3 = new CGeneralLedger();
                entry3.setVoucherlineId(3);
                entry3.setEffectiveDate(new Date());
                entry3.setGlcodeId(coa2);
                entry3.setGlcode(ptcr.getPropertytypecode());
                entry3.setDebitAmount(0.00);
                entry3.setCreditAmount(Double.parseDouble(pt.getTotalcollection().replaceAll(",", "")));
                entry3.setDescription(null);
                entry3.setVoucherHeaderId(cv);
                
                cgeneralLedger.add(entry1);
                cgeneralLedger.add(entry2);
                cgeneralLedger.add(entry3);
                voucherHeaderService.save(cgeneralLedger);
                
            }
            else if(penalty > 0 && intrest <=0) {
           	 CGeneralLedger entry2 = new CGeneralLedger();
                entry2.setVoucherlineId(2);
                entry2.setEffectiveDate(new Date());
                entry2.setGlcodeId(penaltyHead);
                entry2.setGlcode(ptPenalty.getGlcode());
                entry2.setDebitAmount(0.00);
                entry2.setCreditAmount(penalty);
                entry2.setDescription(null);
                entry2.setVoucherHeaderId(cv);
                
                CGeneralLedger entry3 = new CGeneralLedger();
                entry3.setVoucherlineId(3);
                entry3.setEffectiveDate(new Date());
                entry3.setGlcodeId(coa2);
                entry3.setGlcode(ptcr.getPropertytypecode());
                entry3.setDebitAmount(0.00);
                entry3.setCreditAmount(Double.parseDouble(pt.getTotalcollection().replaceAll(",", "")));
                entry3.setDescription(null);
                entry3.setVoucherHeaderId(cv);
                
                cgeneralLedger.add(entry1);
                cgeneralLedger.add(entry2);
                cgeneralLedger.add(entry3);
                voucherHeaderService.save(cgeneralLedger);
            }
            
           } 
           else { 
            CGeneralLedger entry2 = new CGeneralLedger();
            entry2.setVoucherlineId(2);
            entry2.setEffectiveDate(new Date());
            entry2.setGlcodeId(coa2);
            entry2.setGlcode(ptcr.getPropertytypecode());
            entry2.setDebitAmount(0.00);
            entry2.setCreditAmount(Double.parseDouble(pt.getTotalcollection().replaceAll(",", "")));
            entry2.setDescription(null);
            entry2.setVoucherHeaderId(cv);
            cgeneralLedger.add(entry1);
            cgeneralLedger.add(entry2);
            voucherHeaderService.save(cgeneralLedger);
            
           }  
         
    	
    	
    	return propertyTaxReceiptRegister;
    } */
    
    public List<PropertyTaxReceiptRegister> getAlllDatas(PropertyTaxReceiptRegister pt) {
        // Fetch all necessary data
    	List<PropertyTaxReceiptRegister> propertyTaxReceiptRegister = propertyTaxReceiptRegisterRepository.findAll();
    	
   	 List<CVoucherHeader> voucherHeaders = cvoucherHeaderRepository.findAll();
        List<Vouchermis> vouList = vouchermisRepository.findAll();
        List<CGeneralLedger> cg = cgeneralLedgerRepository.findAll();
        
        Optional<CVoucherHeader> cvhh = getDetailsForMaxIdFromVoucherHeader();
        System.out.println(cvhh);
        Long  nextId = cvhh.get().getId()+1;
        String sqlQuery1 = "SELECT COALESCE(MAX(id), 0) FROM voucherheader";
		    BigInteger maxVcId = (BigInteger) entityManager.createNativeQuery(sqlQuery1).getSingleResult();
		    maxVcId = maxVcId.add(BigInteger.ONE);
        
        LocalDate currentDates = LocalDate.now();
        String currentMonth = String.format("%02d", currentDates.getMonthValue()); 
        String currentFinancialYear = currentDates.format(DateTimeFormatter.ofPattern("2024-25")); 
        String newVoucherNumber = String.format("1/RJV/%08d/%s/%s", nextId, currentMonth, currentFinancialYear);
        System.out.println(newVoucherNumber);
        
        int startNumber = 1000000000 + maxVcId.intValue(); // Update startNumber based on nextId
        String formattedId = String.format("%09d", startNumber+nextId);
        String cgvn = "1/JVG/CGVN" + formattedId;
        System.out.println(cgvn);     
        Date currentDateAndTime = new Date();

        Calendar calendar = Calendar.getInstance();
        calendar.setTime(currentDateAndTime);
        calendar.set(Calendar.HOUR_OF_DAY, 0);
        calendar.set(Calendar.MINUTE, 0);
        calendar.set(Calendar.SECOND, 0);
        calendar.set(Calendar.MILLISECOND, 0);
        Date currentDate = calendar.getTime();
        CFiscalPeriod cp = fphd.getFiscalPeriodByDate(currentDate);
        Long fid = cp.getId();
        
        // Create and save a new CVoucherHeader
        CVoucherHeader cVoucherHeader = createVoucherHeader(newVoucherNumber, currentDate, fid, cgvn);
        CVoucherHeader savedCVoucherHeader = voucherHeaderService.save(cVoucherHeader);
        
        // Create and save a new Vouchermis
        Vouchermis vouchermis = createVouchermis(savedCVoucherHeader);
        voucherHeaderService.save(vouchermis);
        
        // Update PropertyTaxReceiptRegister with voucher ID if flag is 0
        if (pt.getFlag() == 0) {
            pt.setVoucherid(savedCVoucherHeader.getId());
            propertyTaxReceiptRegisterRepository.save(pt);
        }
        
        // Prepare and save CGeneralLedger entries
        List<CGeneralLedger> cgeneralLedger = prepareGeneralLedgerEntries(pt, savedCVoucherHeader);
        voucherHeaderService.save(cgeneralLedger);
        
        return propertyTaxReceiptRegister;
    }

    private CVoucherHeader createVoucherHeader(String newVoucherNumber, Date currentDate, Long fiscalPeriodId, String cgvn) {
        Fund fund = getFundById(1);
        CVoucherHeader cVoucherHeader = new CVoucherHeader();
        cVoucherHeader.setId(108L);
        cVoucherHeader.setName("JVGeneral");
        cVoucherHeader.setType("Journal Voucher");
        cVoucherHeader.setDescription("null");
        cVoucherHeader.setEffectiveDate(new Date());
        cVoucherHeader.setVoucherNumber(newVoucherNumber);
        cVoucherHeader.setVoucherDate(currentDate);
        cVoucherHeader.setFundId(fund);
        cVoucherHeader.setFiscalPeriodId(fiscalPeriodId.intValue());
        cVoucherHeader.setStatus(0);
        cVoucherHeader.setOriginalvcId(null);
        cVoucherHeader.setIsConfirmed(null);
        cVoucherHeader.setCreatedBy(251L);
        cVoucherHeader.setRefvhId(null);
        cVoucherHeader.setCgvn(cgvn);
        cVoucherHeader.setLastModifiedBy(251L);
        cVoucherHeader.setLastModifiedDate(new Date());
        cVoucherHeader.setModuleId(null);
        cVoucherHeader.setCreatedDate(new Date());
        return cVoucherHeader;
    }

    private Vouchermis createVouchermis(CVoucherHeader savedCVoucherHeader) {
        Vouchermis vouchermis = new Vouchermis();
        vouchermis.setBillnumber(null);
        vouchermis.setDivisionid(null);
        vouchermis.setDepartmentcode("DEPT_13");
        vouchermis.setVoucherheaderid(savedCVoucherHeader);
        vouchermis.setFundsource(null);
        vouchermis.setSchemeid(null);
        vouchermis.setSubschemeid(null);
        vouchermis.setFunctionary(null);
        vouchermis.setSourcePath(null);
        vouchermis.setBudgetaryAppnumber(null);
        vouchermis.setBudgetCheckReq(null);
        vouchermis.setFunction(null);
        vouchermis.setReferenceDocument(null);
        vouchermis.setServiceName(null);
        return vouchermis;
    }

    private List<CGeneralLedger> prepareGeneralLedgerEntries(PropertyTaxReceiptRegister pt, CVoucherHeader savedCVoucherHeader) {
        PropertyTaxModuleCodesMappingWithCoa ptcr = ptmc.findById(1L);
        PropertyTaxModuleCodesMappingWithCoa ptPenalty = ptmc.findById(7L);
        PropertyTaxModuleCodesMappingWithCoa ptIntrest = ptmc.findById(8L);

        List<CGeneralLedger> cgeneralLedger = new ArrayList<>();
        CChartOfAccounts coa = getById(1167L);
        CChartOfAccounts coa2 = getById(1123L);
        CChartOfAccounts intrestHead = getById(1255L);
        CChartOfAccounts penaltyHead = getById(414L);

        CGeneralLedger entry1 = createGeneralLedgerEntry(1, new Date(), coa, "4502101", 
            Double.parseDouble(pt.getTotalcollection().replaceAll(",", "")), 0.00, savedCVoucherHeader);
        cgeneralLedger.add(entry1);
        Double intrest = Double.parseDouble(pt.getInterest());
        Double penalty = Double.parseDouble(pt.getPenalty());

        if (intrest > 0 || penalty > 0) {
            if (intrest > 0 && penalty >0) {
                CGeneralLedger entry2 = createGeneralLedgerEntry(2, new Date(), intrestHead, ptIntrest.getGlcode(), 
                    0.00, intrest, savedCVoucherHeader);
                cgeneralLedger.add(entry2);
                CGeneralLedger entry3 = createGeneralLedgerEntry(3, new Date(), penaltyHead, ptPenalty.getGlcode(), 
                        0.00, penalty, savedCVoucherHeader);
                    cgeneralLedger.add(entry3);
            }
            else if (intrest > 0) {
            	CGeneralLedger entry2 = createGeneralLedgerEntry(2, new Date(), intrestHead, ptIntrest.getGlcode(), 
                        0.00, intrest, savedCVoucherHeader);
                    cgeneralLedger.add(entry2);
            }
            else if (penalty > 0) {
                CGeneralLedger entry3 = createGeneralLedgerEntry(2, new Date(), penaltyHead, ptPenalty.getGlcode(), 
                    0.00, penalty, savedCVoucherHeader);
                cgeneralLedger.add(entry3);
            }
        }
 
        int size  = cgeneralLedger.size()+1;
        CGeneralLedger entry4 = createGeneralLedgerEntry(size, new Date(), coa2, ptcr.getPropertytypecode(), 
            0.00, Double.parseDouble(pt.getPropertytax().replaceAll(",", "")), savedCVoucherHeader);  
        cgeneralLedger.add(entry4);

        return cgeneralLedger;
    }

    private CGeneralLedger createGeneralLedgerEntry(int voucherLineId, Date effectiveDate, CChartOfAccounts coa, 
        String glcode, Double debitAmount, Double creditAmount, CVoucherHeader savedCVoucherHeader) {
        CGeneralLedger entry = new CGeneralLedger();
        entry.setVoucherlineId(voucherLineId);
        entry.setEffectiveDate(effectiveDate);
        entry.setGlcodeId(coa);
        entry.setGlcode(glcode);
        entry.setDebitAmount(debitAmount);
        entry.setCreditAmount(creditAmount);
        entry.setDescription(null);
        entry.setVoucherHeaderId(savedCVoucherHeader);
        return entry;
    }

    
    
    
    private CVoucherHeader getmaxid() {
    	CVoucherHeader maxIdEntity = cvoucherHeaderRepository.getDetailsForMaxIdFromVoucherHeaders();
    	CVoucherHeader cvvv = null; 
        if (maxIdEntity != null) {
            System.out.println("Maximum ID from voucherheader: " + (maxIdEntity.getId()));
            cvvv = new CVoucherHeader();
            cvvv.setId(maxIdEntity.getId());
        } else {
            System.out.println("No details found for maximum ID in voucherheader.");
        }
       
        return cvvv;
    }
    
	private Object SimpleDateFormat(String string) {
		// TODO Auto-generated method stub
		return null;
	}

	private CChartOfAccounts getById(long l) {
		// TODO Auto-generated method stub
		return chartOfAccountsRepository.findOne(l);
	}

	private CVoucherHeader getById(int i) {
		// TODO Auto-generated method stub
		return cvoucherHeaderRepository.findOne(63L);
	}

	private Fund getFundById(int i) {
		// TODO Auto-generated method stub
		return fundRepository.findByCode("01");
	}
    
    
    
    
    
    

	@Override
	public List<? extends EntityType> getAllActiveEntities(Integer accountDetailTypeId) {
		// TODO Auto-generated method stub
		return null;
	}

	@Override
	public List<? extends EntityType> filterActiveEntities(String filterKey, int maxRecords,
			Integer accountDetailTypeId) {
		// TODO Auto-generated method stub
		return null;
	}

	@Override
	public List getAssetCodesForProjectCode(Integer accountdetailkey) throws ValidationException {
		// TODO Auto-generated method stub
		return null;
	}

	@Override
	public List<? extends EntityType> validateEntityForRTGS(List<Long> idsList) throws ValidationException {
		// TODO Auto-generated method stub
		return null;
	}

	@Override
	public List<? extends EntityType> getEntitiesById(List<Long> idsList) throws ValidationException {
		// TODO Auto-generated method stub
		return null;
	}
	

}
