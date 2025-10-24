# NF-08 – Data Reliability and Quality Management

## 📋 Overview

This document describes how our project implements the non-functional requirement NF-08, which ensures that all displayed information comes from verified sources and remains up-to-date to guarantee that user decisions are based on reliable data.

## 🎯 Objective

Ensure 100% data traceability from official sources (DANE - Departamento Administrativo Nacional de Estadística) to our database, maintaining data integrity and implementing quality control mechanisms throughout the entire data lifecycle.

## 🏛️ Primary Data Source: DANE

### Why DANE?

The **DANE (National Administrative Department of Statistics)** is Colombia's official entity responsible for:
- Producing and disseminating official statistics
- Coordinating the National Statistical System
- Ensuring data quality and reliability at the national level

For our project, DANE provides:
- Monthly food price reports
- Agricultural market information (SIPSA - Sistema de Información de Precios y Abastecimiento del Sector Agropecuario)
- Consumer Price Index (CPI) data
- Statistical summaries validated by national standards

### DANE's Legal Framework and Data Access Limitations

**Important Notice:** DANE does not provide a public API for accessing individual-level data.

#### Legal Framework - Law 2335 of 2023

According to **Law 2335 of 2023**, DANE is legally bound to protect data confidentiality:

- **Individual Data Protection**: Data collected through censuses and surveys cannot be shared with the public or other entities in individual form
- **Aggregated Data Only**: Statistical information is delivered in numerical summaries that do not allow individual data deduction
- **Restricted Purpose**: Individual data cannot be disclosed for commercial, tax, judicial, or any other purposes beyond purely statistical use
- **Confidentiality Obligation**: DANE has a legal obligation to protect the confidentiality of individual data provided by respondents

#### Data Access Method

Due to these legal restrictions:
- ✅ DANE publishes **monthly statistical reports** in aggregated format
- ✅ Data is available through **downloadable datasets** on their official website
- ❌ No real-time API or programmatic access is available
- ❌ Individual-level data is never publicly accessible

#### Alternative Options

While DANE doesn't offer a public API, there are complementary sources:
- **API Colombia**: An independent open-source project providing general data about Colombia (departments, cities, tourist attractions), but not DANE-specific statistical data
- **Open Data Portal**: DANE occasionally publishes datasets on Colombia's open data portal, but updates are not guaranteed via API

## 🔄 Data Management Workflow

Our data management process follows a structured monthly cycle aligned with DANE's publication schedule:

### 1. Data Source Selection (Monthly)

**Responsibility**: Data Engineering Team

**Process**:
1. Access DANE's official website: [https://www.dane.gov.co](https://www.dane.gov.co)
2. Navigate to SIPSA (Sistema de Información de Precios y Abastecimiento del Sector Agropecuario)
3. Review available monthly reports for food prices
4. Identify and download relevant datasets containing:
   - Food product names
   - Prices (minimum, maximum, average)
   - Markets and cities
   - Collection dates
   - Measurement units

**Quality Criteria**:
- ✅ Dataset is from the current or previous month
- ✅ Data format is consistent (CSV, Excel, or standardized format)
- ✅ Metadata includes publication date and data collection period
- ✅ Source is directly from DANE's official domain

**Documentation**:
```
Dataset Selection Log:
- Update Date: [YYYY-MM-DD]
- Downloaded By: [Team member name]
```

### 2. Data Cleaning and Validation

**Objective**: Ensure data quality before integration into our time series prediction model.

python```
- Remove rows with null/missing values in critical fields
- Validate date formats and consistency
- Check for duplicate records
- Verify numeric data types for prices
- Ensure measurement units are standardized
- Detect and handle outliers using IQR method
```

**Critical Fields Requiring No Null Values**:
- `product_name` 
- `price` 
- `market` 
- `city` 


### 3. Manual Data Migration (Monthly)

**Why Manual?** 
Due to the absence of a public DANE API and legal restrictions on data access, we implement a **controlled manual migration process** to ensure:
- Human oversight and quality control
- Compliance with data usage policies
- Verification of data integrity
- Traceable data lineage

#### 3.1 Migration Schedule

**Frequency**: Monthly
**Timing**: Within 5 business days after DANE publishes new reports
**Notification**: Team receives automated reminders via email/Slack

**Migration Calendar**:
```
DANE Publication: ~10th day of each month
Our Migration Window: 10th - 15th day of each month
Validation Deadline: 17th day of each month
Production Deployment: 20th day of each month
```

#### 3.2 Migration Process

**Pre-Migration Checklist**:
- [ ] DANE dataset downloaded and verified
- [ ] Data cleaning executed successfully
- [ ] Backup of current database created
- [ ] Migration script tested in staging environment

**Migration Steps**:

1. **Backup Current Data**:
   ```sql
   -- Create timestamped backup
   CREATE TABLE precios_sipsa_backup_YYYYMMDD AS 
   SELECT * FROM precios_sipsa;
   ```

2. **Execute Migration Script**:
   ```bash
   python migration/dane_monthly_import.py \
     --dataset data/dane_YYYYMM.csv \
     --validate \
     --log-level INFO
   ```

3. **Validate Migration**:
   ```sql
   -- Verify record counts
   SELECT COUNT(*) FROM precios_sipsa 
   WHERE fecha_carga >= CURRENT_DATE;
   
   -- Check for duplicates
   SELECT fecha_registro, producto, mercado, ciudad, COUNT(*) 
   FROM precios_sipsa 
   GROUP BY fecha_registro, producto, mercado, ciudad 
   HAVING COUNT(*) > 1;
   ```

4. **Update Metadata**:
   ```sql
   UPDATE fuentes_datos 
   SET fecha_ultima_actualizacion = CURRENT_TIMESTAMP,
       fecha_proxima_actualizacion = CURRENT_TIMESTAMP + INTERVAL '1 month'
   WHERE nombre_fuente = 'DANE-SIPSA';
   ```

**Post-Migration Verification**:
- [ ] Record count matches expected range
- [ ] No duplicate entries detected
- [ ] Date ranges are continuous
- [ ] Price ranges are within normal thresholds
- [ ] All required products are present
- [ ] Migration log is complete

#### 3.3 Rollback Procedure

If migration fails or data quality issues are detected:

```sql
-- Restore from backup
TRUNCATE TABLE precios_sipsa;
INSERT INTO precios_sipsa 
SELECT * FROM precios_sipsa_backup_YYYYMMDD;

-- Log rollback
INSERT INTO log_migraciones (estado, errores) 
VALUES ('rollback', 'Reason for rollback...');
```

## 📊 Data Traceability and Audit Trail

### Data Lineage

Every record in our database includes:

- **Import timestamp**: When data was last updated.




## ✅ Quality Assurance Measures

### Acceptance Criteria Compliance

| Criterion | Implementation | Status |
|-----------|----------------|--------|
| 100% data from official sources | All data sourced exclusively from DANE | ✅ |
| Updated per official calendar | Monthly migration within 5 days of DANE publication | ✅ |
| Last update date validation | Automatic timestamp and metadata tracking | ✅ |

### Data Quality Metrics

**Monitored KPIs**:
- **Data Freshness**: Days since last DANE publication
- **Completeness**: Percentage of records with all required fields
- **Consistency**: Variance between consecutive months
- **Accuracy**: Outlier detection rate
- **Availability**: System uptime and data accessibility

**Quality Thresholds**:
```
✅ Data Freshness: < 40 days
✅ Completeness: > 95%
✅ Consistency: < 10% variance
✅ Outlier Rate: < 2%
✅ Availability: > 99.5%
```

## 🔮 Future Enhancements


### Medium-term (6-12 months)
- Explore partnerships with DANE for earlier access to data
- Investigate integration with Colombia's Open Data Portal APIs
- Develop predictive alerts for expected publication dates

### Long-term Vision

**Note on Future API Integration**:

While we currently rely on DANE's published datasets, we acknowledge this limitation and remain optimistic about future technological evolution:

> **Trust and Future Direction**: We place our trust in DANE as Colombia's official statistical authority. However, we recognize that our current manual process, while reliable, is not optimal for real-time applications.
>
> **Looking Forward**: As Colombia continues its digital transformation, we anticipate:
> - Potential development of official APIs by DANE (subject to legal framework updates)
> - Emergence of authorized third-party data providers
> - Technological advancements in open data infrastructure
> - Possible amendments to Law 2335 of 2023 to enable secure API access while maintaining privacy
>
> **Prepared for Evolution**: Our system architecture is designed to seamlessly integrate with future APIs when they become available. We continuously monitor:
> - DANE's technological roadmap
> - Government open data initiatives
> - Alternative reliable data sources (agricultural cooperatives, market associations)
> - International best practices in statistical data sharing

**Potential Alternative Sources Under Evaluation**:
- Ministry of Agriculture and Rural Development (MADR)
- Colombian Agricultural Institute (ICA)
- Regional agricultural markets with public reporting
- Academic institutions conducting food price research

## 📚 References and Resources

### Official Sources
- **DANE Official Website**: [https://www.dane.gov.co](https://www.dane.gov.co)
- **SIPSA Information**: [DANE SIPSA Page](https://www.dane.gov.co/index.php/estadisticas-por-tema/agropecuario/sistema-de-informacion-de-precios-sipsa)
- **Law 2335 of 2023**: [Colombian Legal Framework on Statistical Data](https://www.funcionpublica.gov.co/eva/gestornormativo/norma.php?i=207729)


---

## 📝 Document Control

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0 | 2025-10-24 | Data Engineering Team | Initial documentation |

**Last Reviewed**: October 24, 2025  
**Next Review Date**: January 24, 2026  
**Document Owner**: Data Engineering Team  
**Approval Status**: Approved for Implementation 
