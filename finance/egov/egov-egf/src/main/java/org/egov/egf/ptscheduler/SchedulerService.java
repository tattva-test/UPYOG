package org.egov.egf.ptscheduler;

import java.io.IOException;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class SchedulerService {
	  @Autowired
	    private DemandRegisterReportClient demandRegisterReportClient;
	  @Autowired
	  private ReceiptRegisterClient receiptRegisterClient;
	private static final Logger logger = LoggerFactory.getLogger(SchedulerService.class);
    private int runCount = 0;


    public void runTask() {
        logger.info("Scheduled Task Running");
        System.out.println("DEMAND AND RECEIPT DATA FETCHING FROM PROPERTYTAX BY USING SCHEDULER");
        try {
            demandRegisterReportClient.getDemandRegisterData(1716921000000L, 1718044199000L);
            receiptRegisterClient.getReceiptRegisterData(1716921000000L, 1718044199000L);
        } catch (IOException e) {
            logger.error("Error fetching demand register data", e);
            e.printStackTrace();
        }
        logger.info("TODAY ALL PROPERTYTAX DATA SAVE IN FINANCE DB  AND CREATED VOUCHERS ");
    }

}
