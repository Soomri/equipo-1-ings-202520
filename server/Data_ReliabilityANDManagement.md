# NF-08 – Data Reliability and Quality Management

## 📑 Table of Contents

| Section | Description |
|---------|-------------|
| [📋 Overview](#-overview) | Document purpose and scope |
| [🎯 Objective](#-objective) | Primary goals and requirements |
| [🏛️ Primary Data Source: DANE](#️-primary-data-source-dane) | Official data source information |
| [🔄 Data Management Workflow](#-data-management-workflow) | Complete data lifecycle process |
| [📊 Data Traceability and Audit Trail](#-data-traceability-and-audit-trail) | Data lineage and tracking |
| [✅ Quality Assurance Measures](#-quality-assurance-measures) | Quality control and metrics |
| [🔮 Future Enhancements](#-future-enhancements) | Long-term improvements |
| [📚 References and Resources](#-references-and-resources) | External links and documentation |
| [📝 Document Control](#-document-control) | Version control and maintenance |

### Detailed Navigation

| Subsection | Description |
|------------|-------------|
| [Why DANE?](#why-dane) | Rationale for choosing DANE as data source |
| [DANE's Legal Framework](#danes-legal-framework-and-data-access-limitations) | Legal restrictions and compliance |
| [Data Source Selection](#1-data-source-selection-monthly) | Monthly data acquisition process |
| [Data Cleaning and Validation](#2-data-cleaning-and-validation) | Quality assurance procedures |
| [Manual Data Migration](#3-manual-data-migration-monthly) | Monthly migration workflow |
| [Migration Schedule](#31-migration-schedule) | Timeline and calendar |
| [Migration Process](#32-migration-process) | Step-by-step migration procedures |
| [Data Lineage](#data-lineage) | Data traceability information |
| [Acceptance Criteria Compliance](#acceptance-criteria-compliance) | Requirement fulfillment status |
| [Data Quality Metrics](#data-quality-metrics) | KPIs and thresholds |
| [Medium-term Enhancements](#medium-term-6-12-months) | Near-future improvements |
| [Long-term Vision](#long-term-vision) | Future API integration plans |
| [Official Sources](#official-sources) | External references and links |

---

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
1. Access the DANE SIPSA dataset directly at: [https://www.dane.gov.co/index.php/estadisticas-por-tema/agropecuario/sistema-de-informacion-de-precios-sipsa/mayoristas-boletin-mensual-1](https://www.dane.gov.co/index.php/estadisticas-por-tema/agropecuario/sistema-de-informacion-de-precios-sipsa/mayoristas-boletin-mensual-1)
2. Navigate to the monthly food price reports section within the SIPSA dataset
3. Review and select the most recent monthly report for food prices
4. Identify and download relevant datasets containing:
   - Price update date
   - Product name
   - Product category
   - Market name
   - Price per kilogram

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

python
```
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
- `market` and `city`
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

1. Backup Current Data
  
2. Execute Migration by manually importing the cleaned DANE dataset directly into the database 
   
3. Validate Migration
   


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
**Document Owner**: Data Engineering Team  
**Approval Status**: Approved for Implementation 
