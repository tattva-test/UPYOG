package org.egov.services.report;

import org.apache.log4j.Logger;
import org.egov.commons.CChartOfAccounts;
import org.egov.commons.Fund;
import org.egov.egf.model.IEStatementEntry;
import org.egov.egf.model.Statement;
import org.egov.egf.utils.FinancialUtils;
import org.egov.infstr.services.PersistenceService;
import org.egov.utils.Constants;
import org.hibernate.Query;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;

import java.math.BigDecimal;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Map.Entry;

public class CashFlowScheduleService extends ScheduleService {
    @Autowired
    @Qualifier("persistenceService")
    private PersistenceService persistenceService;

    @Autowired
    private FinancialUtils financialUtils;

    private static final String CF = "CF"; // Cash Flow
    private static final String C = "C"; // Cash
    private CashFlowService cashFlowService;
    private static final Logger LOGGER = Logger.getLogger(CashFlowScheduleService.class);

    public void populateDataForCashFlowSchedule(final Statement statement, final String majorCode) {
        if (LOGGER.isInfoEnabled())
            LOGGER.info("Getting cash flow details for selected schedule");
        voucherStatusToExclude = getAppConfigValueFor("EGF", "statusexcludeReport");
        minorCodeLength = Integer.valueOf(cashFlowService.getAppConfigValueFor(Constants.EGF, "coa_minorcode_length"));
        final Date fromDate = cashFlowService.getFromDate(statement);
        final Date toDate = cashFlowService.getToDate(statement);
        Map<String, Object> params = new HashMap<>();
        final String filterQuery = cashFlowService.getFilterQuery(statement, params);
        final CChartOfAccounts coa = (CChartOfAccounts) find("from CChartOfAccounts where glcode=?", majorCode);
        populateCurrentYearAmountForDetail(statement, toDate, fromDate, majorCode, coa.getType(), filterQuery, params);
        cashFlowService.removeFundsWithNoDataCF(statement);
        computeAndAddScheduleTotals(statement);
    }

    public void populateDataForAllSchedules(final Statement statement) {
        voucherStatusToExclude = getAppConfigValueFor("EGF", "statusexcludeReport");
        minorCodeLength = Integer.valueOf(cashFlowService.getAppConfigValueFor(Constants.EGF, "coa_minorcode_length"));
        final Date fromDate = cashFlowService.getFromDate(statement);
        final Date toDate = cashFlowService.getToDate(statement);
        final List<Fund> fundList = statement.getFunds();
        Map<String, Object> params = new HashMap<>();
        populateCurrentYearAmountForAllSchedules(statement, fundList,
                amountPerFundQueryForAllSchedules(cashFlowService.getFilterQuery(statement, params), toDate, fromDate, CF, params));
        params = new HashMap<>();
        populatePreviousYearTotalsForAllSchedules(statement, cashFlowService.getFilterQuery(statement, params), toDate, fromDate, params);
        cashFlowService.removeFundsWithNoData(statement);
        cashFlowService.computeCurrentYearTotals(statement, Constants.LIABILITIES, Constants.ASSETS);
        computeAndAddTotals(statement);
    }

    public void populateDetailcode(final Statement statement) {
        final Date fromDate = cashFlowService.getFromDate(statement);
        final Date toDate = cashFlowService.getToDate(statement);
        if (LOGGER.isDebugEnabled())
            LOGGER.debug("preparing list to load all detailcode");
        populateAmountForAllSchedules(statement, toDate, fromDate, "('C','F')");
        cashFlowService.removeFundsWithNoDataCF(statement);
    }

    boolean isCFContainsScheduleEntry(final List<Object[]> accountCodeList, final String majorCode) {
        for (final Object[] row : accountCodeList)
            if (row[3] != null && majorCode.equals(row[3].toString()))
                return true;
        return false;
    }

    private Query populatePreviousYearTotals(final Statement statement, final Date toDate, final Date fromDate,
                                             final String majorCode, final String filterQuery, final List<Long> fundId, Map<String, Object> params) {
        Date formattedToDate = null;
        final String voucherStatusToExclude = getAppConfigValueFor("EGF", "statusexcludeReport");
        String majorCodeQuery = "";
        final Map<String, Object> sqlParams = new HashMap<>();
        if (!(majorCodeQuery.equals("") || majorCodeQuery.isEmpty())) {
            majorCodeQuery = " and c.majorcode = :majorCode ";
            sqlParams.put("majorCode", majorCode);
        }

        if (LOGGER.isInfoEnabled())
            LOGGER.info("Getting previous year Details");
        if ("Yearly".equalsIgnoreCase(statement.getPeriod()))
            formattedToDate = fromDate;
        else
            formattedToDate = cashFlowService.getPreviousYearFor(toDate);
        final Query query = persistenceService.getSession().createSQLQuery(
                new StringBuilder("select c.glcode,c.name ,sum(g.debitamount)-sum(g.creditamount),v.fundid ,c.type ,")
                        .append("c.majorcode  from generalledger g,chartofaccounts c,voucherheader v ,vouchermis mis")
                        .append(" where v.id=mis.voucherheaderid and  v.fundid in (:fundId)")
                        .append(" and v.id=g.voucherheaderid ")
                        .append(" and c.id=g.glcodeid and v.status not in(:voucherStatusToExclude)")
                        .append(" AND v.voucherdate < :formattedToDate and v.voucherdate >= :formattedFromDate")
                        .append(majorCodeQuery).append(filterQuery)
                        .append(" group by c.glcode, v.fundid,c.name ,c.type ,c.majorcode order by c.glcode,v.fundid,c.type")
                        .toString());
        sqlParams.put("fundId", fundId);
        sqlParams.put("voucherStatusToExclude", financialUtils.getStatuses(voucherStatusToExclude));
        sqlParams.put("formattedToDate", formattedToDate);
        sqlParams.put("formattedFromDate", cashFlowService.getPreviousYearFor(fromDate));
        sqlParams.putAll(params);
        persistenceService.populateQueryWithParams(query, sqlParams);
        if (LOGGER.isInfoEnabled())
            LOGGER.info("previous year to Date=" + formattedToDate + " and from Date="
                    + cashFlowService.getPreviousYearFor(fromDate));
        return query;
    }

    public void populateDetailcode(final Statement statement) {
        final Date fromDate = cashFlowService.getFromDate(statement);
        final Date toDate = cashFlowService.getToDate(statement);
        if (LOGGER.isDebugEnabled())
            LOGGER.debug("preparing list to load all detailcode");
        populateAmountForAllSchedules(statement, toDate, fromDate, "('C','F')");
        cashFlowService.removeFundsWithNoDataCF(statement);

    }

    boolean isCFContainsScheduleEntry(final List<Object[]> accountCodeList, final String majorCode) {
        for (final Object[] row : accountCodeList)
            if (row[3] != null && majorCode.equals(row[3].toString()))
                return true;
        return false;
    }

    private void populateAmountForAllSchedules(final Statement statement, final Date toDate, final Date fromDate,
                                                final String type) {
        final List<Fund> fundList = statement.getFunds();
        Map<String, Object> params = new HashMap<>();
        for (final Fund fund : fundList) {
            params = new HashMap<>();
            final List<Object[]> accountCodeList = (List<Object[]>) populateAmountPerFundForAllSchedules(statement,
                    cashFlowService.getFilterQuery(statement, params), toDate, fromDate, fund.getId(), type, params);
            for (final Object[] row : accountCodeList) {
                if (row[4] != null && "C".equals(row[4].toString())) {
                    statement.setOpeningBalance(BigDecimal.ZERO);
                    final StatementEntry ieStatementEntry = new StatementEntry();
                    cfStatementEntry.setAmount(BigDecimal.ZERO);
                    cfStatementEntry.setAccountName(row[1].toString());
                    cfStatementEntry.setFundName(fund.getName());
                    cfStatementEntry.setGlc(row[0].toString());
                    statement.addCFStatementEntry(cfStatementEntry);
                } else {
                    statement.setOpeningBalance(BigDecimal.ZERO);
                    final CFStatementEntry cfStatementEntry = new CFStatementEntry();
                    cfStatementEntry.setOpeningBalance(BigDecimal.ZERO);
                    cfStatementEntry.setClosingBalance(BigDecimal.ZERO);
                    cfStatementEntry.setFundName(fund.getName());
                    cfStatementEntry.setGlc(row[0].toString());
                    cfStatementEntry.setAccountName(row[1].toString());
                    cfStatementEntry.setAmount(BigDecimal.ZERO);
                    statement.addCFStatementEntry(cfStatementEntry);
                }
            }
        }
    }

    public void removeFundsWithNoData(final Statement statement) {
        final List<Fund> fundList = statement.getFunds();
        for (final Fund fund : fundList) {
            if (isFundWithNoData(statement, fund)) {
                final List<CFStatementEntry> entries = statement.getStatementEntries();
                for (final CFStatementEntry entry : entries) {
                    if (fund.getName().equals(entry.getFundName()))
                        entries.remove(entry);
                }
            }
        }
    }

    public void removeFundsWithNoDataCF(final Statement statement) {
        final List<Fund> fundList = statement.getFunds();
        for (final Fund fund : fundList) {
            if (isFundWithNoData(statement, fund)) {
                final List<StatementEntry> entries = statement.getCFStatementEntries();
                for (final StatementEntry entry : entries) {
                    if (fund.getName().equals(entry.getFundName()))
                        entries.remove(entry);
                }
            }
        }
    }

    public void computeCurrentYearTotals(final Statement statement, final String liabilities, final String assets) {
        final List<StatementEntry> entries = statement.getCFStatementEntries();
        BigDecimal totalLiabilities = BigDecimal.ZERO;
        BigDecimal totalAssets = BigDecimal.ZERO;
        for (final StatementEntry entry : entries) {
            if (assets.equals(entry.getGlc())) {
                totalAssets = totalAssets.add(entry.getAmount());
            } else if (liabilities.equals(entry.getGlc())) {
                totalLiabilities = totalLiabilities.add(entry.getAmount());
            }
        }
        final StatementEntry totalLiabilityEntry = new StatementEntry();
        totalLiabilityEntry.setAmount(totalLiabilities);
        totalLiabilityEntry.setAccountName(liabilities);
        statement.addCFStatementEntry(totalLiabilityEntry);

        final StatementEntry totalAssetsEntry = new StatementEntry();
        totalAssetsEntry.setAmount(totalAssets);
        totalAssetsEntry.setAccountName(assets);
        statement.addCFStatementEntry(totalAssetsEntry);
    }

    // Add additional methods specific to cash flow schedule service as needed
}
