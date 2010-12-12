--
-- Table `coordinate_types_cot`
--

CREATE TABLE IF NOT EXISTS `coordinate_types_cot` (
  `id_cot` int(11) NOT NULL AUTO_INCREMENT,
  `key_cot` varchar(10) NOT NULL,
  `name_cot` varchar(255) NOT NULL,
  `description_cot` text,
  `created_cot` datetime DEFAULT NULL,
  `modified_cot` datetime DEFAULT NULL,
  PRIMARY KEY (`id_cot`)
) ENGINE=MyISAM  DEFAULT CHARSET=latin1 ;

INSERT INTO `coordinate_types_cot` (`id_cot`, `key_cot`, `name_cot`, `description_cot`, `created_cot`, `modified_cot`) VALUES
(4, 'user', 'User', NULL, NOW(), NOW()),
(5, 'content', 'Content', NULL, NOW(), NOW()),
(6, 'campaign', 'Campaign', NULL, NOW(), NOW()),
(7, 'group', 'Group', NULL, NOW(), NOW());


--
-- Table `coordinates_crd`
--

CREATE TABLE IF NOT EXISTS `coordinates_crd` (
  `id_crd` int(11) NOT NULL AUTO_INCREMENT,
  `id_cot_crd` int(11) NOT NULL,
  `id_owner_crd` int(11) NOT NULL,
  `latitude_crd` float NOT NULL,
  `longitude_crd` float NOT NULL,
  `address_crd` varchar(160) DEFAULT NULL,
  `created_crd` datetime DEFAULT NULL,
  `modified_crd` datetime DEFAULT NULL,
  PRIMARY KEY (`id_crd`)
) ENGINE=MyISAM  DEFAULT CHARSET=latin1 ;