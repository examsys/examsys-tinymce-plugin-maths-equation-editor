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

echo "Building combined css files\n";

function compress($buffer)
{
    /* remove comments */
    $buffer = preg_replace('!/\*[^*]*\*+([^/][^*]*\*+)*/!', '', $buffer);
    /* remove tabs, spaces, newlines, etc. */
    $buffer = str_replace(array("\r\n", "\r", "\n", "\t", '  ', '    ', '    '), '', $buffer);

    return $buffer;
}

/* your css files */
$output = "/*DO NOT MODIFY THIS FILE*/\n";
$files = array();
$files[] = 'edit.css';
$files[] = 'fonts.css';
$files[] = 'main.css';
$files[] = 'toolbar.css';
foreach ($files as $file) {
    echo "\tCompressing " . $file . "\n";
    $output .= compress(file_get_contents('../mee/mee/css/' . $file));
}

file_put_contents('../mee/mee/css/combined.css', $output);
echo "Saved as css/combined.css\n";
