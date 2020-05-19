-- MySQL dump 10.13  Distrib 5.6.35, for Win32 (AMD64)
--
-- Host: localhost    Database: crscell
-- ------------------------------------------------------
-- Server version	5.6.35-log

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Current Database: `crscell`
--

CREATE DATABASE /*!32312 IF NOT EXISTS*/ `crscell` /*!40100 DEFAULT CHARACTER SET gbk */;

USE `crscell`;

--
-- Table structure for table `crs_annotation`
--

DROP TABLE IF EXISTS `crs_annotation`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `crs_annotation` (
  `id` int(10) NOT NULL AUTO_INCREMENT COMMENT '自增id',
  `repid` int(10) NOT NULL COMMENT '报表id',
  `userid` varchar(20) NOT NULL,
  `writetime` varchar(25) NOT NULL,
  `rid` char(38) NOT NULL COMMENT '数据记录行rid',
  `cid` char(38) NOT NULL COMMENT '字段id',
  `writerid` varchar(20) NOT NULL COMMENT '填写者userid',
  `formulas` varchar(256) DEFAULT NULL COMMENT '公式内容',
  `memo` text COMMENT '批注',
  PRIMARY KEY (`id`),
  KEY `idx_r_u_w` (`repid`,`userid`,`writetime`)
) ENGINE=InnoDB DEFAULT CHARSET=gbk COMMENT='批注';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `crs_annotation`
--

LOCK TABLES `crs_annotation` WRITE;
/*!40000 ALTER TABLE `crs_annotation` DISABLE KEYS */;
/*!40000 ALTER TABLE `crs_annotation` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `crs_archive_reportstate`
--

DROP TABLE IF EXISTS `crs_archive_reportstate`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `crs_archive_reportstate` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `repid` int(10) unsigned DEFAULT NULL,
  `organid` int(10) unsigned DEFAULT NULL,
  `userid` varchar(20) DEFAULT NULL,
  `writetime` varchar(25) DEFAULT '0000-00-00 00:00:00',
  `workflow` tinytext,
  `state` varchar(30) DEFAULT '初始填报',
  `deadline` varchar(25) DEFAULT '0000-00-00 00:00:00',
  `organidlist` tinytext,
  `useridlist` tinytext,
  `writetimelist` tinytext,
  `finishtimelist` tinytext,
  `prevtask` tinytext,
  `prevorgan` int(10) unsigned DEFAULT NULL,
  `prevwriter` varchar(20) DEFAULT NULL,
  `prevtime` varchar(25) DEFAULT NULL,
  `berolled` char(2) DEFAULT NULL,
  `dataflow` longtext,
  `sendid` varchar(40) DEFAULT NULL,
  `acceptid` varchar(40) DEFAULT NULL,
  `assigneduserlist` tinytext,
  `endtime` varchar(25) DEFAULT '0000-00-00 00:00:00',
  `rollbacksign` varchar(100) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `index_item` (`repid`,`userid`,`writetime`)
) ENGINE=InnoDB DEFAULT CHARSET=gbk;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `crs_archive_reportstate`
--

LOCK TABLES `crs_archive_reportstate` WRITE;
/*!40000 ALTER TABLE `crs_archive_reportstate` DISABLE KEYS */;
/*!40000 ALTER TABLE `crs_archive_reportstate` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `crs_autocode`
--

DROP TABLE IF EXISTS `crs_autocode`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `crs_autocode` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `label` tinytext,
  `prefix` varchar(255) DEFAULT NULL,
  `datetimepart` varchar(255) DEFAULT NULL,
  `digitlength` int(10) unsigned DEFAULT NULL,
  `minvalue` int(10) unsigned NOT NULL DEFAULT '1',
  `maxvalue` int(10) unsigned DEFAULT NULL,
  `reusetype` varchar(20) DEFAULT '不可重用',
  `newpoint` varchar(20) DEFAULT '新建报表时',
  `autofold` char(2) DEFAULT NULL,
  `curvalue` int(10) unsigned DEFAULT NULL,
  `nousecode` text,
  `nousenum` text,
  `rule_let` varchar(100) DEFAULT NULL,
  `let_curvalue` text,
  `let_colref` text,
  `last_date` varchar(25) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=gbk;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `crs_autocode`
--

LOCK TABLES `crs_autocode` WRITE;
/*!40000 ALTER TABLE `crs_autocode` DISABLE KEYS */;
/*!40000 ALTER TABLE `crs_autocode` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `crs_board`
--

DROP TABLE IF EXISTS `crs_board`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `crs_board` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(255) DEFAULT NULL,
  `typeid` int(11) DEFAULT NULL,
  `orderno` smallint(6) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=gbk;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `crs_board`
--

LOCK TABLES `crs_board` WRITE;
/*!40000 ALTER TABLE `crs_board` DISABLE KEYS */;
/*!40000 ALTER TABLE `crs_board` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `crs_boarditem`
--

DROP TABLE IF EXISTS `crs_boarditem`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `crs_boarditem` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `boardid` int(11) DEFAULT NULL,
  `type` varchar(20) DEFAULT NULL,
  `label` varchar(50) DEFAULT NULL,
  `dataset_id` varchar(255) DEFAULT NULL,
  `filter_cols` tinytext,
  `horiz_cols` tinytext,
  `vert_cols` tinytext,
  `data_cols` tinytext,
  `aleft` int(11) DEFAULT NULL,
  `top` int(11) DEFAULT NULL,
  `width` int(11) DEFAULT NULL,
  `height` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=gbk;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `crs_boarditem`
--

LOCK TABLES `crs_boarditem` WRITE;
/*!40000 ALTER TABLE `crs_boarditem` DISABLE KEYS */;
/*!40000 ALTER TABLE `crs_boarditem` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `crs_boardtype`
--

DROP TABLE IF EXISTS `crs_boardtype`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `crs_boardtype` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(255) DEFAULT NULL,
  `orderno` tinyint(4) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=gbk;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `crs_boardtype`
--

LOCK TABLES `crs_boardtype` WRITE;
/*!40000 ALTER TABLE `crs_boardtype` DISABLE KEYS */;
/*!40000 ALTER TABLE `crs_boardtype` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `crs_bookmark`
--

DROP TABLE IF EXISTS `crs_bookmark`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `crs_bookmark` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `repid` int(11) DEFAULT NULL,
  `userid` varchar(20) DEFAULT NULL,
  `writetime` datetime DEFAULT NULL,
  `marktime` datetime DEFAULT NULL,
  `marker` varchar(20) DEFAULT NULL,
  `memo` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=gbk;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `crs_bookmark`
--

LOCK TABLES `crs_bookmark` WRITE;
/*!40000 ALTER TABLE `crs_bookmark` DISABLE KEYS */;
/*!40000 ALTER TABLE `crs_bookmark` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `crs_chart`
--

DROP TABLE IF EXISTS `crs_chart`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `crs_chart` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `repid` int(10) unsigned DEFAULT NULL,
  `label` tinytext,
  `data_range` tinytext,
  `orientation` varchar(20) DEFAULT NULL,
  `title` tinytext,
  `xlabel` tinytext,
  `ylabel` tinytext,
  `v3d` char(2) DEFAULT NULL,
  `chart_type` varchar(20) DEFAULT NULL,
  `color` int(10) unsigned DEFAULT NULL,
  `category_name` tinytext,
  `series_name` tinytext,
  `aleft` int(10) unsigned DEFAULT NULL,
  `atop` int(10) unsigned DEFAULT NULL,
  `aright` int(10) unsigned DEFAULT NULL,
  `abottom` int(10) unsigned DEFAULT NULL,
  `sheetindex` int(10) unsigned DEFAULT NULL,
  `xrange` tinytext,
  `xcoordinate` text,
  `ycoordinate` text,
  `bgcolor` int(11) DEFAULT NULL,
  `color_span` tinytext NOT NULL,
  `realtime` int(10) unsigned DEFAULT NULL,
  `y_min` int(11) DEFAULT NULL,
  `y_max` int(11) DEFAULT NULL,
  `trend_fn` varchar(50) DEFAULT NULL,
  `trend_type` varchar(50) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=gbk;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `crs_chart`
--

LOCK TABLES `crs_chart` WRITE;
/*!40000 ALTER TABLE `crs_chart` DISABLE KEYS */;
/*!40000 ALTER TABLE `crs_chart` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `crs_columnindex`
--

DROP TABLE IF EXISTS `crs_columnindex`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `crs_columnindex` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `tableid` int(10) unsigned DEFAULT NULL,
  `columnname` varchar(100) DEFAULT NULL,
  `cellspan` varchar(100) DEFAULT NULL,
  `columnlabel` tinytext,
  `datatype` varchar(10) DEFAULT NULL,
  `codeid` longtext,
  `displaystyle` varchar(200) DEFAULT NULL,
  `iskey` char(2) DEFAULT NULL,
  `ismust` tinytext,
  `ordertype` varchar(10) DEFAULT NULL,
  `iskeep` char(2) DEFAULT NULL,
  `ishidden` char(2) DEFAULT NULL,
  `mergetype` varchar(20) NOT NULL DEFAULT ' 不汇总',
  `readonly` char(2) DEFAULT NULL,
  `notonlist` char(2) NOT NULL DEFAULT '',
  `position` int(10) unsigned NOT NULL DEFAULT '0',
  `defaultval` tinytext,
  `refrepid` tinytext,
  `refrepcond` text,
  `refrepvcond` text,
  `isgroup` char(2) DEFAULT NULL,
  `kid` varchar(40) DEFAULT NULL,
  `color` int(11) DEFAULT NULL,
  `istogether` char(2) DEFAULT NULL,
  `radiogroup` tinytext,
  `disablecond` text,
  `checkformulas` text,
  `checktitle` tinytext,
  `warninfo` tinytext,
  `checkaction` varchar(6) DEFAULT NULL,
  `info` tinytext,
  `isonly` char(2) DEFAULT NULL,
  `dataref` text,
  `barcode` varchar(20) DEFAULT NULL,
  `merge_equal` char(2) DEFAULT NULL,
  `to_trace` char(2) DEFAULT NULL,
  `has_inline_calcu` char(2) DEFAULT NULL,
  `datas_from_template` text,
  `ishidden2` char(2) DEFAULT NULL,
  `on_seq_list` char(2) DEFAULT NULL,
  `can_annotation` char(2) DEFAULT '' COMMENT '允许批注标识',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=gbk;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `crs_columnindex`
--

LOCK TABLES `crs_columnindex` WRITE;
/*!40000 ALTER TABLE `crs_columnindex` DISABLE KEYS */;
/*!40000 ALTER TABLE `crs_columnindex` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `crs_datatrace`
--

DROP TABLE IF EXISTS `crs_datatrace`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `crs_datatrace` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `rkid` varchar(40) DEFAULT NULL,
  `ckid` varchar(40) DEFAULT NULL,
  `writer` varchar(40) DEFAULT NULL,
  `updatetime` datetime DEFAULT NULL,
  `prev_val` text,
  `val` text,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=gbk;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `crs_datatrace`
--

LOCK TABLES `crs_datatrace` WRITE;
/*!40000 ALTER TABLE `crs_datatrace` DISABLE KEYS */;
/*!40000 ALTER TABLE `crs_datatrace` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `crs_detailreadpriv`
--

DROP TABLE IF EXISTS `crs_detailreadpriv`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `crs_detailreadpriv` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `reportid` int(10) unsigned DEFAULT NULL,
  `organid` varchar(10) DEFAULT NULL,
  `roleid` varchar(50) DEFAULT NULL,
  `readmode` text,
  `cancheck` char(2) NOT NULL DEFAULT 'n',
  `canmerge` char(2) NOT NULL DEFAULT 'n',
  `columnlist` text,
  `afilter` text,
  `avfilter` text,
  `canexport` char(2) DEFAULT NULL,
  `canprint` char(2) DEFAULT NULL,
  `ismanager` char(2) DEFAULT NULL,
  `remind_label` varchar(100) DEFAULT NULL,
  `remind_cond` text,
  `remind_vcond` text,
  `readmode_vexpr` text,
  `to_concern` char(2) DEFAULT NULL,
  `remind_span` smallint(6) DEFAULT NULL,
  `view_done` char(1) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=gbk;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `crs_detailreadpriv`
--

LOCK TABLES `crs_detailreadpriv` WRITE;
/*!40000 ALTER TABLE `crs_detailreadpriv` DISABLE KEYS */;
/*!40000 ALTER TABLE `crs_detailreadpriv` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `crs_detailwritepriv`
--

DROP TABLE IF EXISTS `crs_detailwritepriv`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `crs_detailwritepriv` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `reportid` int(10) unsigned DEFAULT NULL,
  `organid` varchar(10) DEFAULT NULL,
  `roleid` varchar(50) DEFAULT NULL,
  `new` char(2) DEFAULT NULL,
  `updat` text,
  `destroy` text,
  `columnlist` text,
  `vcolumnlist` text,
  `afilter` text,
  `avfilter` text,
  `updat_vexpr` text,
  `destroy_vexpr` text,
  `noappend_tab` tinytext,
  `nodelete_tab` tinytext,
  `noinsert_tab` tinytext COMMENT '禁止插行',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=gbk;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `crs_detailwritepriv`
--

LOCK TABLES `crs_detailwritepriv` WRITE;
/*!40000 ALTER TABLE `crs_detailwritepriv` DISABLE KEYS */;
/*!40000 ALTER TABLE `crs_detailwritepriv` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `crs_drawinfo`
--

DROP TABLE IF EXISTS `crs_drawinfo`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `crs_drawinfo` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `topid` int(11) DEFAULT NULL,
  `type` varchar(50) DEFAULT NULL,
  `itemid` int(11) DEFAULT NULL,
  `left` int(11) DEFAULT NULL,
  `top` int(11) DEFAULT NULL,
  `width` int(11) DEFAULT NULL,
  `height` int(11) DEFAULT NULL,
  `c_width` int(11) DEFAULT NULL,
  `c_height` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=gbk;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `crs_drawinfo`
--

LOCK TABLES `crs_drawinfo` WRITE;
/*!40000 ALTER TABLE `crs_drawinfo` DISABLE KEYS */;
/*!40000 ALTER TABLE `crs_drawinfo` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `crs_entrust`
--

DROP TABLE IF EXISTS `crs_entrust`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `crs_entrust` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `repid` text,
  `user_id` varchar(20) NOT NULL DEFAULT '' COMMENT '户用ID',
  `to_id` tinytext NOT NULL COMMENT '被委托人编号，多人用,隔开',
  `begin_date` date DEFAULT NULL COMMENT '始开日期',
  `end_date` date DEFAULT NULL COMMENT '终止日期',
  `status` char(1) DEFAULT '' COMMENT '态状值，1为开启，0为关闭',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=gbk;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `crs_entrust`
--

LOCK TABLES `crs_entrust` WRITE;
/*!40000 ALTER TABLE `crs_entrust` DISABLE KEYS */;
/*!40000 ALTER TABLE `crs_entrust` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `crs_formulas`
--

DROP TABLE IF EXISTS `crs_formulas`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `crs_formulas` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `repid` int(10) unsigned DEFAULT NULL,
  `label` tinytext,
  `formulastype` varchar(20) NOT NULL DEFAULT '取数公式',
  `workflowtime` varchar(200) DEFAULT NULL,
  `apptime` varchar(100) NOT NULL DEFAULT '筛选条件改变后自动执行',
  `isdistinct` varchar(255) DEFAULT NULL,
  `tablelist` text,
  `table_link` text,
  `condition_expr` text,
  `compute_expr` text,
  `target_expr` text,
  `order_expr` tinytext,
  `fill_table` varchar(200) DEFAULT NULL,
  `fill_expr` text,
  `position` int(10) unsigned NOT NULL DEFAULT '0',
  `condition_vexpr` text,
  `fill_vexpr` text,
  `isrecusive` varchar(50) DEFAULT NULL,
  `funname` varchar(50) DEFAULT NULL,
  `fetch_end` char(1) DEFAULT NULL,
  `phplet` varchar(200) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=gbk;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `crs_formulas`
--

LOCK TABLES `crs_formulas` WRITE;
/*!40000 ALTER TABLE `crs_formulas` DISABLE KEYS */;
/*!40000 ALTER TABLE `crs_formulas` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `crs_gridpara`
--

DROP TABLE IF EXISTS `crs_gridpara`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `crs_gridpara` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `repid` int(11) DEFAULT NULL,
  `userid` varchar(20) DEFAULT NULL,
  `kid` varchar(40) DEFAULT NULL,
  `tonew` char(1) DEFAULT NULL,
  `wid` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `idx` (`repid`,`userid`,`kid`,`tonew`)
) ENGINE=InnoDB DEFAULT CHARSET=gbk;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `crs_gridpara`
--

LOCK TABLES `crs_gridpara` WRITE;
/*!40000 ALTER TABLE `crs_gridpara` DISABLE KEYS */;
/*!40000 ALTER TABLE `crs_gridpara` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `crs_hyperlink`
--

DROP TABLE IF EXISTS `crs_hyperlink`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `crs_hyperlink` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `repid` int(11) DEFAULT NULL,
  `userid` varchar(20) DEFAULT NULL,
  `writetime` varchar(25) DEFAULT NULL,
  `sheetindex` int(11) DEFAULT NULL,
  `col` int(11) DEFAULT NULL,
  `row` int(11) DEFAULT NULL,
  `info` tinytext,
  `hyperlink` text,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=gbk;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `crs_hyperlink`
--

LOCK TABLES `crs_hyperlink` WRITE;
/*!40000 ALTER TABLE `crs_hyperlink` DISABLE KEYS */;
/*!40000 ALTER TABLE `crs_hyperlink` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `crs_logiccheck`
--

DROP TABLE IF EXISTS `crs_logiccheck`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `crs_logiccheck` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `reportid` int(10) unsigned DEFAULT NULL,
  `expr` tinytext,
  `expl` tinytext,
  `color` int(10) unsigned NOT NULL DEFAULT '1',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=gbk;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `crs_logiccheck`
--

LOCK TABLES `crs_logiccheck` WRITE;
/*!40000 ALTER TABLE `crs_logiccheck` DISABLE KEYS */;
/*!40000 ALTER TABLE `crs_logiccheck` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `crs_para`
--

DROP TABLE IF EXISTS `crs_para`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `crs_para` (
  `name` varchar(30) NOT NULL DEFAULT '',
  `value` tinytext
) ENGINE=InnoDB DEFAULT CHARSET=gbk;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `crs_para`
--

LOCK TABLES `crs_para` WRITE;
/*!40000 ALTER TABLE `crs_para` DISABLE KEYS */;
INSERT INTO `crs_para` VALUES ('MACHINE_CODE','00000000'),('REGISTER_NAME',''),('REGISTER_CODE',''),('FIRST_LOGIN_TIME',''),('LAST_LOGIN_TIME',''),('CUR_VER_NO','6,0'),('CUR_CRSCELL_VER_NO','6,0,0,35'),('CUR_CRSCELL_CLASS','75B2196F-E164-445A-ADCA-A15DDEFF24B0');
/*!40000 ALTER TABLE `crs_para` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `crs_parsecache`
--

DROP TABLE IF EXISTS `crs_parsecache`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `crs_parsecache` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `repid` int(11) DEFAULT NULL,
  `formulasid` int(11) DEFAULT NULL,
  `cur_table_ref_list` text,
  `cur_column_ref_list` text,
  `column_ref_back_list` text,
  `column_ref_list` text,
  `fill_expr_list` text,
  `_sql` longtext,
  `_sql2` longtext,
  `be_merged` char(1) DEFAULT NULL,
  `be_hasmatch` char(1) DEFAULT NULL,
  `be_hasif` char(1) DEFAULT NULL,
  `recursive_cond_expr` text,
  `recursive_expr` text,
  `column_ref_back` text,
  `cond_sql` text,
  `db_label` varchar(50) DEFAULT NULL,
  `merged_formulas_index_list` varchar(50) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=gbk;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `crs_parsecache`
--

LOCK TABLES `crs_parsecache` WRITE;
/*!40000 ALTER TABLE `crs_parsecache` DISABLE KEYS */;
/*!40000 ALTER TABLE `crs_parsecache` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `crs_period`
--

DROP TABLE IF EXISTS `crs_period`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `crs_period` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `item` varchar(255) DEFAULT NULL,
  `btime` date DEFAULT NULL,
  `etime` date DEFAULT NULL,
  `type` varchar(10) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=gbk;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `crs_period`
--

LOCK TABLES `crs_period` WRITE;
/*!40000 ALTER TABLE `crs_period` DISABLE KEYS */;
/*!40000 ALTER TABLE `crs_period` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `crs_pntpara`
--

DROP TABLE IF EXISTS `crs_pntpara`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `crs_pntpara` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `repid` int(10) unsigned DEFAULT NULL,
  `para` tinytext,
  `value` text,
  `sheetindex` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=gbk;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `crs_pntpara`
--

LOCK TABLES `crs_pntpara` WRITE;
/*!40000 ALTER TABLE `crs_pntpara` DISABLE KEYS */;
/*!40000 ALTER TABLE `crs_pntpara` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `crs_print_templates`
--

DROP TABLE IF EXISTS `crs_print_templates`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `crs_print_templates` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `repid` int(11) DEFAULT NULL,
  `label` varchar(50) DEFAULT NULL,
  `file_name` varchar(255) DEFAULT NULL,
  `isstop` char(1) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=gbk;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `crs_print_templates`
--

LOCK TABLES `crs_print_templates` WRITE;
/*!40000 ALTER TABLE `crs_print_templates` DISABLE KEYS */;
/*!40000 ALTER TABLE `crs_print_templates` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `crs_quick_reportstate`
--

DROP TABLE IF EXISTS `crs_quick_reportstate`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `crs_quick_reportstate` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `repid` int(11) DEFAULT NULL,
  `userid` varchar(20) DEFAULT NULL,
  `writetime` varchar(25) DEFAULT NULL,
  `workflow` varchar(200) DEFAULT NULL,
  `writer` varchar(20) DEFAULT NULL,
  `writetime2` varchar(25) DEFAULT NULL,
  `finished` char(1) DEFAULT NULL,
  `prevtask` varchar(200) DEFAULT NULL,
  `prevwriter` varchar(20) DEFAULT NULL,
  `prevtime` varchar(25) DEFAULT NULL,
  `stateid` int(11) DEFAULT NULL,
  `assignedwriter` varchar(20) DEFAULT NULL,
  `endtime` varchar(25) DEFAULT NULL,
  `berolled` char(2) DEFAULT NULL,
  `title` varchar(256) DEFAULT '' COMMENT '标题',
  PRIMARY KEY (`id`),
  KEY `idx` (`repid`,`userid`,`writetime`,`workflow`(50),`finished`)
) ENGINE=InnoDB DEFAULT CHARSET=gbk;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `crs_quick_reportstate`
--

LOCK TABLES `crs_quick_reportstate` WRITE;
/*!40000 ALTER TABLE `crs_quick_reportstate` DISABLE KEYS */;
/*!40000 ALTER TABLE `crs_quick_reportstate` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `crs_readstate`
--

DROP TABLE IF EXISTS `crs_readstate`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `crs_readstate` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `kid` varchar(40) DEFAULT NULL,
  `repid` int(10) unsigned DEFAULT NULL,
  `organid` int(10) unsigned DEFAULT NULL,
  `userid` varchar(20) DEFAULT NULL,
  `writetime` varchar(25) DEFAULT NULL,
  `reader_list` text,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=gbk;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `crs_readstate`
--

LOCK TABLES `crs_readstate` WRITE;
/*!40000 ALTER TABLE `crs_readstate` DISABLE KEYS */;
/*!40000 ALTER TABLE `crs_readstate` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `crs_remarks`
--

DROP TABLE IF EXISTS `crs_remarks`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `crs_remarks` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `repid` int(10) NOT NULL,
  `remark` text,
  `fromuid` varchar(10) DEFAULT NULL,
  `toid` int(10) DEFAULT NULL,
  `step` varchar(200) DEFAULT '',
  `writetime` datetime DEFAULT NULL,
  `userid` varchar(10) DEFAULT NULL,
  `remarktime` datetime DEFAULT NULL,
  `attach_id` varchar(255) DEFAULT NULL,
  `attach_name` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=gbk;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `crs_remarks`
--

LOCK TABLES `crs_remarks` WRITE;
/*!40000 ALTER TABLE `crs_remarks` DISABLE KEYS */;
/*!40000 ALTER TABLE `crs_remarks` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `crs_remind_log`
--

DROP TABLE IF EXISTS `crs_remind_log`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `crs_remind_log` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `repid` int(11) DEFAULT NULL,
  `item` varchar(100) DEFAULT NULL,
  `last_execute_time` datetime DEFAULT NULL,
  `next_execute_time` datetime DEFAULT NULL,
  `type` varchar(20) DEFAULT NULL,
  `reminder` tinytext,
  `remind_desc` text,
  `all_t` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=gbk;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `crs_remind_log`
--

LOCK TABLES `crs_remind_log` WRITE;
/*!40000 ALTER TABLE `crs_remind_log` DISABLE KEYS */;
/*!40000 ALTER TABLE `crs_remind_log` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `crs_remind_statis`
--

DROP TABLE IF EXISTS `crs_remind_statis`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `crs_remind_statis` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `exec_time` datetime DEFAULT NULL,
  `all_t` int(11) DEFAULT NULL,
  `task_t` int(11) DEFAULT NULL,
  `submit_t` int(11) DEFAULT NULL,
  `remind_t` int(11) DEFAULT NULL,
  `warn_t` int(11) DEFAULT NULL,
  `task_list` longtext,
  `submit_list` longtext,
  `remind_list` longtext,
  `warn_list` longtext,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=134 DEFAULT CHARSET=gbk;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `crs_remind_statis`
--

LOCK TABLES `crs_remind_statis` WRITE;
/*!40000 ALTER TABLE `crs_remind_statis` DISABLE KEYS */;
INSERT INTO `crs_remind_statis` VALUES (122,'2019-08-23 13:40:28',1663,733,328,2,4,'','','',''),(123,'2019-08-23 15:40:28',1504,687,296,2,2,'','','',''),(124,'2019-08-23 17:40:29',2444,1093,514,4,3,'','','',''),(125,'2019-08-23 19:40:28',1582,702,344,2,2,'','','',''),(126,'2019-08-23 21:40:28',1630,702,328,2,1,'','','',''),(127,'2019-08-23 23:40:28',1675,688,374,2,2,'','','',''),(128,'2019-08-24 01:40:28',1722,780,359,2,2,'','','',''),(129,'2019-08-24 03:40:28',1722,765,359,2,2,'','','',''),(130,'2019-08-24 05:40:28',1659,750,344,2,2,'','','',''),(131,'2019-08-24 07:40:28',1676,813,328,2,2,'','','',''),(132,'2019-08-24 09:40:28',1596,719,344,2,2,'','','',''),(133,'2019-08-24 11:40:28',1815,812,421,2,1,'','','','');
/*!40000 ALTER TABLE `crs_remind_statis` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `crs_repidlist_with_priv`
--

DROP TABLE IF EXISTS `crs_repidlist_with_priv`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `crs_repidlist_with_priv` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `userid` varchar(40) NOT NULL DEFAULT '',
  `repid_list` longtext,
  PRIMARY KEY (`id`,`userid`),
  UNIQUE KEY `idx_userid` (`userid`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=gbk;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `crs_repidlist_with_priv`
--

LOCK TABLES `crs_repidlist_with_priv` WRITE;
/*!40000 ALTER TABLE `crs_repidlist_with_priv` DISABLE KEYS */;
/*!40000 ALTER TABLE `crs_repidlist_with_priv` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `crs_report`
--

DROP TABLE IF EXISTS `crs_report`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `crs_report` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `repno` tinytext NOT NULL,
  `repname` tinytext NOT NULL,
  `kindid` int(10) unsigned DEFAULT NULL,
  `type` varchar(100) DEFAULT NULL,
  `statistype` text,
  `mode` char(2) DEFAULT NULL,
  `changemode` char(2) DEFAULT NULL,
  `write_priv_organ` mediumtext,
  `write_priv_role` mediumtext,
  `read_priv_organ` mediumtext,
  `read_priv_role` mediumtext,
  `workflowid` int(10) unsigned DEFAULT NULL,
  `detail_write_priv_id` int(10) unsigned DEFAULT NULL,
  `detail_read_priv_id` int(10) unsigned DEFAULT NULL,
  `cell` longblob,
  `main_table_id` int(10) unsigned DEFAULT NULL,
  `main_table_name` tinytext,
  `detail_table_id` int(10) unsigned DEFAULT NULL,
  `detail_table_name` tinytext,
  `picturelist` tinytext,
  `kid` varchar(200) DEFAULT NULL,
  `isquery` char(2) DEFAULT NULL,
  `canupload` char(2) DEFAULT NULL,
  `cansave` char(2) DEFAULT NULL,
  `isstop` char(2) DEFAULT NULL,
  `orderno` int(11) DEFAULT NULL,
  `cursor1` varchar(40) DEFAULT NULL,
  `hiddengrid` char(2) DEFAULT NULL,
  `canconsign` char(2) DEFAULT NULL,
  `lockedcol` int(11) DEFAULT NULL,
  `lockedrow` int(11) DEFAULT NULL,
  `is_musttitle` char(2) DEFAULT NULL,
  `hiddenwrite` char(2) DEFAULT NULL,
  `hiddencontent` char(2) DEFAULT NULL,
  `caneditref` char(2) DEFAULT NULL,
  `canrollback` char(2) DEFAULT NULL,
  `showzerovalue` char(2) DEFAULT NULL,
  `noallowclone` char(2) DEFAULT NULL,
  `keepwritetime` char(2) DEFAULT NULL,
  `personasunit` char(2) DEFAULT NULL,
  `is_subrep` char(2) DEFAULT NULL,
  `sheet_sz` int(11) DEFAULT NULL,
  `noallowfrozen` char(2) DEFAULT NULL,
  `myhome` char(1) DEFAULT NULL,
  `support_html_rep` char(1) DEFAULT NULL,
  `pw` varchar(40) NOT NULL,
  `auto_height` char(2) DEFAULT NULL,
  `title_schema` text,
  `subtitle_schema` text,
  `has_inline_calcu` char(2) DEFAULT NULL,
  `datasetid` int(11) DEFAULT NULL,
  `f_cols` text,
  `x_cols` text,
  `y_cols` text,
  `d_cols` text,
  `create_time` date DEFAULT NULL,
  `update_time` date DEFAULT NULL,
  `isbasic` char(1) DEFAULT NULL,
  `noimportdata` char(1) DEFAULT NULL,
  `save_silent` char(1) DEFAULT NULL,
  `sms_link_to_list` char(1) DEFAULT NULL,
  `using_bpm` char(1) DEFAULT NULL,
  `module_url` varchar(255) DEFAULT NULL,
  `tittle_can_be_edited` char(1) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=gbk;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `crs_report`
--

LOCK TABLES `crs_report` WRITE;
/*!40000 ALTER TABLE `crs_report` DISABLE KEYS */;
/*!40000 ALTER TABLE `crs_report` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `crs_reportbulletin`
--

DROP TABLE IF EXISTS `crs_reportbulletin`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `crs_reportbulletin` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `repid` int(11) DEFAULT NULL,
  `userid` varchar(20) DEFAULT NULL,
  `writetime` varchar(25) DEFAULT NULL,
  `begintime` date DEFAULT NULL,
  `endtime` date DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=gbk;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `crs_reportbulletin`
--

LOCK TABLES `crs_reportbulletin` WRITE;
/*!40000 ALTER TABLE `crs_reportbulletin` DISABLE KEYS */;
/*!40000 ALTER TABLE `crs_reportbulletin` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `crs_reportstate`
--

DROP TABLE IF EXISTS `crs_reportstate`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `crs_reportstate` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `repid` int(10) unsigned DEFAULT NULL,
  `organid` int(10) unsigned DEFAULT NULL,
  `userid` varchar(20) DEFAULT NULL,
  `writetime` varchar(25) DEFAULT '0000-00-00 00:00:00',
  `workflow` tinytext,
  `state` varchar(30) DEFAULT '初始填报',
  `deadline` varchar(25) DEFAULT '0000-00-00 00:00:00',
  `organidlist` tinytext,
  `useridlist` tinytext,
  `writetimelist` tinytext,
  `finishtimelist` tinytext,
  `prevtask` tinytext,
  `prevorgan` int(10) unsigned DEFAULT NULL,
  `prevwriter` varchar(20) DEFAULT NULL,
  `prevtime` varchar(25) DEFAULT NULL,
  `berolled` char(2) DEFAULT NULL,
  `dataflow` longtext,
  `sendid` varchar(40) DEFAULT NULL,
  `acceptid` varchar(40) DEFAULT NULL,
  `assigneduserlist` tinytext,
  `endtime` varchar(25) DEFAULT NULL,
  `rollbacksign` varchar(100) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `index_item` (`repid`,`userid`,`writetime`)
) ENGINE=InnoDB DEFAULT CHARSET=gbk;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `crs_reportstate`
--

LOCK TABLES `crs_reportstate` WRITE;
/*!40000 ALTER TABLE `crs_reportstate` DISABLE KEYS */;
/*!40000 ALTER TABLE `crs_reportstate` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `crs_rule`
--

DROP TABLE IF EXISTS `crs_rule`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `crs_rule` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(255) DEFAULT NULL,
  `repid` int(11) DEFAULT NULL,
  `cond_expr` text,
  `cond_vexpr` text,
  `level` int(11) DEFAULT '1',
  `organid_list` text,
  `userid_list` text,
  `privid_list` text,
  `column_list` text,
  `remind_type` char(10) DEFAULT NULL,
  `remind_content` text,
  `create_time` date DEFAULT NULL,
  `update_time` date DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=gbk;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `crs_rule`
--

LOCK TABLES `crs_rule` WRITE;
/*!40000 ALTER TABLE `crs_rule` DISABLE KEYS */;
/*!40000 ALTER TABLE `crs_rule` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `crs_statis`
--

DROP TABLE IF EXISTS `crs_statis`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `crs_statis` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `create_time` date DEFAULT NULL,
  `cur` varchar(20) DEFAULT NULL,
  `repid` int(11) DEFAULT NULL,
  `userid` varchar(20) DEFAULT NULL,
  `writetime` varchar(25) DEFAULT NULL,
  `openmode` varchar(10) DEFAULT NULL,
  `cache_t` int(11) DEFAULT NULL,
  `schema_t` int(11) DEFAULT NULL,
  `mode_t` int(11) DEFAULT NULL,
  `send_t` int(11) DEFAULT NULL,
  `load_t` int(11) DEFAULT NULL,
  `all_t` int(11) DEFAULT NULL,
  `cur_userid` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=gbk;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `crs_statis`
--

LOCK TABLES `crs_statis` WRITE;
/*!40000 ALTER TABLE `crs_statis` DISABLE KEYS */;
/*!40000 ALTER TABLE `crs_statis` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `crs_synsign`
--

DROP TABLE IF EXISTS `crs_synsign`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `crs_synsign` (
  `repid` int(11) DEFAULT NULL,
  `label` char(32) NOT NULL DEFAULT '' COMMENT '住锁的报表，由”模板ID+UserID+WriteTime”拼接而成',
  `writer` varchar(20) DEFAULT NULL COMMENT '持锁者',
  `time` int(10) DEFAULT NULL COMMENT '持锁时间',
  PRIMARY KEY (`label`)
) ENGINE=InnoDB DEFAULT CHARSET=gbk;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `crs_synsign`
--

LOCK TABLES `crs_synsign` WRITE;
/*!40000 ALTER TABLE `crs_synsign` DISABLE KEYS */;
/*!40000 ALTER TABLE `crs_synsign` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `crs_tabledata5`
--

DROP TABLE IF EXISTS `crs_tabledata5`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `crs_tabledata5` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `kid` varchar(40) DEFAULT NULL,
  `organid` int(11) unsigned NOT NULL DEFAULT '1',
  `userid` varchar(20) NOT NULL DEFAULT 'admin',
  `writetime` varchar(25) DEFAULT '0000-00-00 00:00:00',
  `uploadtime` varchar(25) DEFAULT '0000-00-00 00:00:00',
  `updatetime` datetime DEFAULT NULL,
  `logiccheck` varchar(20) NOT NULL DEFAULT 'unchecked',
  `isfrozen` char(2) NOT NULL DEFAULT 'n',
  `ismerge` char(2) NOT NULL DEFAULT 'n',
  `rkid` varchar(40) DEFAULT NULL,
  `displayseq` int(10) NOT NULL DEFAULT '1',
  `title` varchar(255) DEFAULT NULL,
  `memo` tinytext,
  `col1183` varchar(500) DEFAULT NULL,
  `col1182` date DEFAULT NULL,
  `col1181` varchar(500) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `kid` (`kid`),
  KEY `idx_u_w` (`userid`,`writetime`)
) ENGINE=InnoDB DEFAULT CHARSET=gbk;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `crs_tabledata5`
--

LOCK TABLES `crs_tabledata5` WRITE;
/*!40000 ALTER TABLE `crs_tabledata5` DISABLE KEYS */;
/*!40000 ALTER TABLE `crs_tabledata5` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `crs_tabledata5c`
--

DROP TABLE IF EXISTS `crs_tabledata5c`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `crs_tabledata5c` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `kid` varchar(40) DEFAULT NULL,
  `organid` int(11) unsigned NOT NULL DEFAULT '1',
  `userid` varchar(20) NOT NULL DEFAULT 'admin',
  `writetime` varchar(25) DEFAULT '0000-00-00 00:00:00',
  `uploadtime` varchar(25) DEFAULT '0000-00-00 00:00:00',
  `updatetime` datetime DEFAULT NULL,
  `logiccheck` varchar(20) NOT NULL DEFAULT 'unchecked',
  `isfrozen` char(2) NOT NULL DEFAULT 'n',
  `ismerge` char(2) NOT NULL DEFAULT 'n',
  `rkid` varchar(40) DEFAULT NULL,
  `displayseq` int(10) NOT NULL DEFAULT '1',
  `title` varchar(255) DEFAULT NULL,
  `memo` tinytext,
  `curlabel` varchar(25) DEFAULT NULL,
  `col1183` varchar(500) DEFAULT NULL,
  `col1182` date DEFAULT NULL,
  `col1181` varchar(500) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=gbk;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `crs_tabledata5c`
--

LOCK TABLES `crs_tabledata5c` WRITE;
/*!40000 ALTER TABLE `crs_tabledata5c` DISABLE KEYS */;
/*!40000 ALTER TABLE `crs_tabledata5c` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `crs_tabledata6`
--

DROP TABLE IF EXISTS `crs_tabledata6`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `crs_tabledata6` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `kid` varchar(40) DEFAULT NULL,
  `organid` int(11) unsigned NOT NULL DEFAULT '1',
  `userid` varchar(20) NOT NULL DEFAULT 'admin',
  `writetime` varchar(25) DEFAULT '0000-00-00 00:00:00',
  `uploadtime` varchar(25) DEFAULT '0000-00-00 00:00:00',
  `updatetime` datetime DEFAULT NULL,
  `logiccheck` varchar(20) NOT NULL DEFAULT 'unchecked',
  `isfrozen` char(2) NOT NULL DEFAULT 'n',
  `ismerge` char(2) NOT NULL DEFAULT 'n',
  `rkid` varchar(40) DEFAULT NULL,
  `displayseq` int(10) NOT NULL DEFAULT '1',
  `title` varchar(255) DEFAULT NULL,
  `memo` tinytext,
  `col1174` double DEFAULT NULL,
  `col1173` double DEFAULT NULL,
  `col1172` double DEFAULT NULL,
  `col1180` double DEFAULT NULL,
  `col1171` double DEFAULT NULL,
  `col1170` double DEFAULT NULL,
  `col1169` double DEFAULT NULL,
  `col1168` double DEFAULT NULL,
  `col1167` double DEFAULT NULL,
  `col1179` double DEFAULT NULL,
  `col1166` double DEFAULT NULL,
  `col1178` double DEFAULT NULL,
  `col1165` double DEFAULT NULL,
  `col1177` double DEFAULT NULL,
  `col1164` double DEFAULT NULL,
  `col1176` double DEFAULT NULL,
  `col1163` double DEFAULT NULL,
  `col1175` double DEFAULT NULL,
  `col1162` double DEFAULT NULL,
  `col1161` double DEFAULT NULL,
  `col1160` double DEFAULT NULL,
  `col1159` double DEFAULT NULL,
  `col1137` double DEFAULT NULL,
  `col1158` double DEFAULT NULL,
  `col1157` double DEFAULT NULL,
  `col1156` double DEFAULT NULL,
  `col1155` double DEFAULT NULL,
  `col1154` double DEFAULT NULL,
  `col1153` double DEFAULT NULL,
  `col1152` double DEFAULT NULL,
  `col1151` double DEFAULT NULL,
  `col1150` double DEFAULT NULL,
  `col1149` double DEFAULT NULL,
  `col1147` double DEFAULT NULL,
  `col1148` double DEFAULT NULL,
  `col1145` double DEFAULT NULL,
  `col1146` double DEFAULT NULL,
  `col1143` double DEFAULT NULL,
  `col1144` double DEFAULT NULL,
  `col1141` double DEFAULT NULL,
  `col1142` double DEFAULT NULL,
  `col1140` double DEFAULT NULL,
  `col1139` double DEFAULT NULL,
  `col1138` double DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `kid` (`kid`),
  KEY `idx_u_w` (`userid`,`writetime`)
) ENGINE=InnoDB DEFAULT CHARSET=gbk;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `crs_tabledata6`
--

LOCK TABLES `crs_tabledata6` WRITE;
/*!40000 ALTER TABLE `crs_tabledata6` DISABLE KEYS */;
/*!40000 ALTER TABLE `crs_tabledata6` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `crs_tabledata6c`
--

DROP TABLE IF EXISTS `crs_tabledata6c`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `crs_tabledata6c` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `kid` varchar(40) DEFAULT NULL,
  `organid` int(11) unsigned NOT NULL DEFAULT '1',
  `userid` varchar(20) NOT NULL DEFAULT 'admin',
  `writetime` varchar(25) DEFAULT '0000-00-00 00:00:00',
  `uploadtime` varchar(25) DEFAULT '0000-00-00 00:00:00',
  `updatetime` datetime DEFAULT NULL,
  `logiccheck` varchar(20) NOT NULL DEFAULT 'unchecked',
  `isfrozen` char(2) NOT NULL DEFAULT 'n',
  `ismerge` char(2) NOT NULL DEFAULT 'n',
  `rkid` varchar(40) DEFAULT NULL,
  `displayseq` int(10) NOT NULL DEFAULT '1',
  `title` varchar(255) DEFAULT NULL,
  `memo` tinytext,
  `curlabel` varchar(25) DEFAULT NULL,
  `col1174` double DEFAULT NULL,
  `col1173` double DEFAULT NULL,
  `col1172` double DEFAULT NULL,
  `col1180` double DEFAULT NULL,
  `col1171` double DEFAULT NULL,
  `col1170` double DEFAULT NULL,
  `col1169` double DEFAULT NULL,
  `col1168` double DEFAULT NULL,
  `col1167` double DEFAULT NULL,
  `col1179` double DEFAULT NULL,
  `col1166` double DEFAULT NULL,
  `col1178` double DEFAULT NULL,
  `col1165` double DEFAULT NULL,
  `col1177` double DEFAULT NULL,
  `col1164` double DEFAULT NULL,
  `col1176` double DEFAULT NULL,
  `col1163` double DEFAULT NULL,
  `col1175` double DEFAULT NULL,
  `col1162` double DEFAULT NULL,
  `col1161` double DEFAULT NULL,
  `col1160` double DEFAULT NULL,
  `col1159` double DEFAULT NULL,
  `col1137` double DEFAULT NULL,
  `col1158` double DEFAULT NULL,
  `col1157` double DEFAULT NULL,
  `col1156` double DEFAULT NULL,
  `col1155` double DEFAULT NULL,
  `col1154` double DEFAULT NULL,
  `col1153` double DEFAULT NULL,
  `col1152` double DEFAULT NULL,
  `col1151` double DEFAULT NULL,
  `col1150` double DEFAULT NULL,
  `col1149` double DEFAULT NULL,
  `col1147` double DEFAULT NULL,
  `col1148` double DEFAULT NULL,
  `col1145` double DEFAULT NULL,
  `col1146` double DEFAULT NULL,
  `col1143` double DEFAULT NULL,
  `col1144` double DEFAULT NULL,
  `col1141` double DEFAULT NULL,
  `col1142` double DEFAULT NULL,
  `col1140` double DEFAULT NULL,
  `col1139` double DEFAULT NULL,
  `col1138` double DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=gbk;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `crs_tabledata6c`
--

LOCK TABLES `crs_tabledata6c` WRITE;
/*!40000 ALTER TABLE `crs_tabledata6c` DISABLE KEYS */;
/*!40000 ALTER TABLE `crs_tabledata6c` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `crs_tableindex`
--

DROP TABLE IF EXISTS `crs_tableindex`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `crs_tableindex` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `repid` int(10) unsigned NOT NULL DEFAULT '0',
  `sheetindex` int(10) unsigned NOT NULL DEFAULT '1',
  `name` tinytext,
  `label` tinytext,
  `tabletype` varchar(20) NOT NULL DEFAULT '主表',
  `expandtype` varchar(20) NOT NULL DEFAULT '按行向下',
  `ismain` char(2) NOT NULL DEFAULT '',
  `iscreated` char(2) NOT NULL DEFAULT 'n',
  `initcz` int(10) unsigned NOT NULL DEFAULT '1',
  `ishidden` char(2) NOT NULL DEFAULT '',
  `position` int(10) NOT NULL DEFAULT '-1',
  `titlearea` varchar(200) DEFAULT NULL,
  `vcolumnarea` varchar(200) DEFAULT NULL,
  `hcolumnarea` varchar(200) DEFAULT NULL,
  `dataarea` varchar(200) DEFAULT NULL,
  `description` longtext,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=gbk;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `crs_tableindex`
--

LOCK TABLES `crs_tableindex` WRITE;
/*!40000 ALTER TABLE `crs_tableindex` DISABLE KEYS */;
/*!40000 ALTER TABLE `crs_tableindex` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `crs_timer`
--

DROP TABLE IF EXISTS `crs_timer`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `crs_timer` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `repid` int(11) DEFAULT NULL,
  `type` varchar(30) DEFAULT NULL,
  `month` varchar(10) DEFAULT NULL,
  `day` varchar(10) DEFAULT NULL,
  `time` varchar(25) DEFAULT NULL,
  `writer` text,
  `last_exec_time` varchar(25) DEFAULT NULL,
  `to_new` char(2) DEFAULT NULL,
  `to_update` char(2) DEFAULT NULL,
  `create_time` date DEFAULT NULL,
  `update_time` date DEFAULT NULL,
  `to_turn` char(2) DEFAULT NULL,
  `next_user` longtext,
  `update_cond` text,
  `update_vcond` text,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=gbk;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `crs_timer`
--

LOCK TABLES `crs_timer` WRITE;
/*!40000 ALTER TABLE `crs_timer` DISABLE KEYS */;
/*!40000 ALTER TABLE `crs_timer` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `crs_workflow`
--

DROP TABLE IF EXISTS `crs_workflow`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `crs_workflow` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `repid` int(10) unsigned DEFAULT NULL,
  `is_link` char(2) DEFAULT NULL,
  `label` tinytext,
  `is_begin` char(2) DEFAULT NULL,
  `lifecycle` varchar(255) DEFAULT NULL,
  `priv_organ` tinytext,
  `priv_role` mediumtext,
  `column_list` longtext,
  `newrepid` tinytext,
  `data_flow` mediumtext,
  `conexpr` mediumtext,
  `para` tinytext,
  `vcolumnlist` mediumtext,
  `is_end` char(2) DEFAULT NULL,
  `schedulemode` varchar(20) DEFAULT NULL,
  `onlyredirect` char(2) DEFAULT NULL,
  `autoopen` char(2) DEFAULT NULL,
  `autoassign` char(2) DEFAULT NULL,
  `liferef` tinytext,
  `vliferef` tinytext,
  `nosat` char(1) DEFAULT NULL,
  `nosun` char(1) DEFAULT NULL,
  `operation` char(10) DEFAULT NULL,
  `remind` tinyint(4) DEFAULT NULL,
  `convexpr` mediumtext,
  `vdata_flow` mediumtext,
  `remind_organ` mediumtext,
  `remind_role` mediumtext,
  `remind_type` smallint(6) DEFAULT NULL,
  `is_remark` char(1) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=gbk;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `crs_workflow`
--

LOCK TABLES `crs_workflow` WRITE;
/*!40000 ALTER TABLE `crs_workflow` DISABLE KEYS */;
/*!40000 ALTER TABLE `crs_workflow` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping routines for database 'crscell'
--
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2020-05-19 17:51:37
