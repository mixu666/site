<?php
/**
 *  Database model for coordinates table.
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
 *  Coordinates - class
 *
 *  @package    models
 *  @author     Mikko Aatola
 *  @copyright  2010 Mikko Aatola
 *  @license    GPL v2
 *  @version    1.0
 */ 
class Default_Model_Coordinates extends Zend_Db_Table_Abstract
{
    // Table name
    protected $_name = 'coordinates_crd';
    
    // Table primary key
    protected $_primary = 'id_crd';

    /**
     * getCoordinates
     *
     * @param string $key_cot
     * @param int    $id_owner
     * @return array selected db row, null on error
     */
    public function getCoordinates($key_cot, $id_owner)
    {
        // Get id for content type.
        $cotModel = new Default_Model_CoordinateTypes();
        $id_cot = $cotModel->getIdByType($key_cot);
        if (!$id_cot || !$id_owner)
            return null;

        $select = $this->select()
            ->from('coordinates_crd', array('*'))
            ->where('id_cot_crd = ?', $id_cot)
            ->where('id_owner_crd = ?', $id_owner);
        $result = $this->fetchAll($select);

        return $result ? $result->toArray() : null;
    }

    /**
     * getAllCoordinates
     *
     * Returns all coordinates of the specified type.
     *
     * @param string $key_cot the type of coordinates to get (user, group, etc.)
     * @return array
     */
    public function getAllCoordinates($key_cot = null, $n = null, $s = null, $e = null, $w = null)
    {
        if ($key_cot) {
            // Get id for content type.
            $cotModel = new Default_Model_CoordinateTypes();
            $id_cot = $cotModel->getIdByType($key_cot);
            if (!$id_cot)
                return null;
        }

        $select = $this->select()
            ->from('coordinates_crd', array('*'));
        if ($n !== null && $s !== null && $e !== null && $w !== null) {
            $select = $select
                ->where('latitude_crd > ?', $s)
                ->where('latitude_crd < ?', $n)
                ->where('longitude_crd > ?', $w)
                ->where('longitude_crd < ?', $e);
        }
        if ($id_cot)
            $select = $select->where('id_cot_crd = ?', $id_cot);
        $result = $this->fetchAll($select);

        return $result ? $result->toArray() : null;
    }

    /**
     * getAllUserCoordinates
     *
     * Gets all user coordinates with getAllCoordinates() and
     * adds the users' login names to the returned array.
     *
     * @return array
     */
    public function getAllUserCoordinates($n = null, $s = null, $e = null, $w = null)
    {
        $coords = $this->getAllCoordinates('user', $n, $s, $e, $w);
        if (!$coords)
            return null;

        $usrModel = new Default_Model_User();
        $loginNames = $usrModel->getLoginNames();

        foreach ($coords as $key => $coord) {
            $coords[$key]['loginname'] = $loginNames[$coord['id_owner_crd']];
        }

        return $coords;
    }

    /**
     * getAllGroupCoordinates
     *
     * Gets all group coordinates with getAllCoordinates() and
     * adds the groups' names to the returned array.
     *
     * @return array
     */
    public function getAllGroupCoordinates($n = null, $s = null, $e = null, $w = null)
    {
        $coords = $this->getAllCoordinates('group', $n, $s, $e, $w);
        if (!$coords)
            return null;

        $grpModel = new Default_Model_Groups();
        $grpNames = $grpModel->getNames();

        foreach ($coords as $key => $coord) {
            $coords[$key]['groupname'] = $grpNames[$coord['id_owner_crd']];
        }

        return $coords;
    }

    /**
     * getAllCampaignCoordinates
     *
     * Gets all campaign coordinates with getAllCoordinates() and
     * adds the campaigns' names to the returned array.
     *
     * @return array
     */
    public function getAllCampaignCoordinates($n = null, $s = null, $e = null, $w = null)
    {
        $coords = $this->getAllCoordinates('campaign', $n, $s, $e, $w);
        if (!$coords)
            return null;

        $cmpModel = new Default_Model_Campaigns();
        $cmpNames = $cmpModel->getNames();

        foreach ($coords as $key => $coord) {
            $coords[$key]['campaignname'] = $cmpNames[$coord['id_owner_crd']];
        }

        return $coords;
    }

    /**
     * getAllContentCoordinates
     *
     * Gets all content coordinates with getAllCoordinates() and
     * adds the contents' titles to the returned array.
     *
     * @return array
     */
    public function getAllContentCoordinates($n = null, $s = null, $e = null, $w = null)
    {
        $coords = $this->getAllCoordinates('content', $n, $s, $e, $w);
        if (!$coords)
            return null;

        $cntModel = new Default_Model_Content();
        $cntNames = $cntModel->getTitles();

        foreach ($coords as $key => $coord) {
            $coords[$key]['title_cnt'] = $cntNames[$coord['id_owner_crd']]['title_cnt'];
            $coords[$key]['key_cty'] = $cntNames[$coord['id_owner_crd']]['key_cty'];
            $coords[$key]['login_name_usr'] = $cntNames[$coord['id_owner_crd']]['login_name_usr'];
        }

        return $coords;
    }

    public function getItemsByCoordinates($lat, $lng, $key_cot)
    {
        // Get id for content type.
        $cotModel = new Default_Model_CoordinateTypes();
        $id_cot = $cotModel->getIdByType($key_cot);
        if (!$id_cot)
            return null;

        $select = $this->select()
            ->from('coordinates_crd', array('*'))
            ->where('latitude_crd = ?', $lat)
            ->where('longitude_crd = ?', $lng)
            ->where('id_cot_crd = ?', $id_cot);
        $result = $this->fetchAll($select);

        return $result ? $result->toArray() : null;
    }

    public function getAllItemsByCoordinates($lat, $lng)
    {
        $users = $this->getItemsByCoordinates($lat, $lng, 'user');
        $content = $this->getItemsByCoordinates($lat, $lng, 'content');
        $groups = $this->getItemsByCoordinates($lat, $lng, 'group');
        $campaigns = $this->getItemsByCoordinates($lat, $lng, 'campaign');

        $result = array();
        $result['users'] = $users;
        $result['content'] = $content;
        $result['groups'] = $groups;
        $result['campaigns'] = $campaigns;

        return $result;
    }

    /**
     * setCoordinates
     *
     * @param string       $key_cot
     * @param int          $id_owner
     * @param float|string $lat
     * @param float|string $long
     * @param string       $addr
     * @return int|null    id of the row created/updated, null on error
     */
    public function setCoordinates($key_cot, $id_owner, $lat, $long, $addr)
    {
        // Get id for content type.
        $cotModel = new Default_Model_CoordinateTypes();
        $id_cot = $cotModel->getIdByType($key_cot);
        if (!$id_cot)
            return null;

        $id_crd = $this->coordinatesExist($id_cot, $id_owner);
        if ($id_crd) {
            // Update existing.
            $data = array(
                'latitude_crd' => $lat,
                'longitude_crd' => $long,
                'address_crd' => $addr,
                'modified_crd' => new Zend_Db_Expr('NOW()'),
            );
            $where = $this->getAdapter()->quoteInto('id_crd = ?', $id_crd);
            $this->update($data, $where);

            return $id_crd;
        } else {
            // Create new.
            $row = $this->createRow();

            $row->id_cot_crd = $id_cot;
            $row->id_owner_crd = $id_owner;
            $row->latitude_crd = $lat;
            $row->longitude_crd = $long;
            $row->address_crd = $addr;
            $row->created_crd = new Zend_Db_Expr('NOW()');
            $row->modified_crd = new Zend_Db_Expr('NOW()');

            $row->save();

            return $row->id_crd;
        }
    }

    /**
     * Checks if given owner's (user, group, etc.) coordinates exist in db.
     *
     * @author Mikko Aatola
     * @param int $type type of the owner (user, content, etc.)
     * @param int $owner id of the owner
     * @return int|bool coordinate id if exists, false otherwise
     */
    public function coordinatesExist($type, $owner)
    {
        $select = $this->select()
            ->from('coordinates_crd', 'id_crd')
            ->where('id_cot_crd = ?', $type)
            ->where('id_owner_crd = ?', $owner);
        $result = $this->fetchAll($select);

        if ($result) {
            $result = $result->toArray();
            return $result[0]['id_crd'];
        } else {
            return false;
        }
    }

    public function removeCoordinates($key_cot, $id_owner)
    {
        // Get id for content type.
        $cotModel = new Default_Model_CoordinateTypes();
        $id_cot = $cotModel->getIdByType($key_cot);
        if (!$id_cot)
            return null;

        // Delete row.
        $where_cot = $this->getAdapter()->quoteInto('id_cot_crd = ?', $id_cot);
        $where_owner = $this->getAdapter()->quoteInto('id_owner_crd = ?', $id_owner);
        $this->delete($where_cot . ' AND ' . $where_owner);
    }
}