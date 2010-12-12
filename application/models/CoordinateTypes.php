<?php
/**
 *  Database model for coordinate types table.
 *
 *  Copyright (c) <2010>, Mikko Aatola
 *
 *  This program is free software; you can redistribute it and/or modify it under the terms of the GNU General Public License 
 *  as published by the Free Software Foundation; either version 2 of the License, or (at your option) any later version.
 * 
 *  This program is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied  
 *  warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU General Public License for  
 *  more details.
 * 
 *  You should have received a copy of the GNU General Public License along with this program; if not, write to the Free 
 *  Software Foundation, Inc., 59 Temple Place, Suite 330, Boston, MA 02111-1307 USA
 *
 *  License text found in /license/
 */

/**
 *  CoordinateTypes - class
 *
 *  @package    models
 *  @author     Mikko Aatola
 *  @copyright  2010 Mikko Aatola
 *  @license    GPL v2
 *  @version    1.0
 */ 
class Default_Model_CoordinateTypes extends Zend_Db_Table_Abstract
{
    // Table name
    protected $_name = 'coordinate_types_cot';
    
    // Table primary key
    protected $_primary = 'id_cot';

	public function getIdByType($type)
	{
		$select = $this->select()
            ->from($this, array('id_cot'))
            ->where('`key_cot` = ?', $type);
		$result = $this->fetchAll($select);

        if ($result) {
            $result = $result->toArray();
            return $result[0]['id_cot'];
        } else {
            return null;
        }
	}
}