<?php

// This file is part of ExamSys
//
// ExamSys is free software: you can redistribute it and/or modify
// it under the terms of the GNU General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.
//
// ExamSys is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU General Public License for more details.
//
// You should have received a copy of the GNU General Public License
// along with ExamSys.  If not, see <http://www.gnu.org/licenses/>.

/**
 *
 * @author Adam Clarke
 * @version 1.0
 * @copyright Copyright (c) 2014 The University of Nottingham
 * @package
 */

if (PHP_SAPI != 'cli') {
    die("Please run this script from the CLI!\n");
}

echo "Making Images\n";

$toconvert = array();
//$toconvert['&#x221A;'] = 'MathJax_Main-Regular';
$toconvert['log'] = 'MathJax_Main-Regular';

foreach ($toconvert as $char => $font) {
    echo "\tConverting " . $char . " using ";

    $im = imagecreatetruecolor(1000, 1000);
    $white = imagecolorallocate($im, 255, 255, 255);
    imagefilledrectangle($im, 0, 0, 1000, 1000, $white);
    $black = imagecolorallocate($im, 0, 0, 0);
    imagecolortransparent($im, $white);
    $font = 'fonts/' . $font . '.ttf';
    echo $font . "\n";
    imagettftext($im, 400, 0, 200, 700, $black, $font, $char);
    imagepng($im, $char . '.png');
}
