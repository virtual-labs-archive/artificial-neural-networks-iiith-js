<?php
if ($trainFlag == 1) {
    if ($numberOfBits == -1 | $numberOfBits == -2) {
        echo '<table><tr style="text-align: center;"><td><b>Training data</b></td><td><b>Training error</b></td></tr>';
        echo "<td><img name=curimage id=curimage width=600 src=tmp/mlffnntrainingSamples.png> </td>";
        echo "<td><img name=curimage id=curimage width=600 src=tmp/mlffnnState.png> </td>";
        echo '</tr></table>';
    } else
        echo "'<table><tr style=\"text-align: center;\"><td><b>Training error</b></td></tr>
<tr><td><img name=curimage id=curimage width=600 src=tmp/mlffnnState.png></td></tr></table>'";

}

if ($testFlag == 1) {
    if ($numberOfBits == -1 | $numberOfBits == -2) {
        echo '<table><tr style="text-align: center;"><td><b>Training data</b></td><td><b>Classification of test data</b></td></tr>';
        echo "<tr><td><img name=curimage id=curimage width=600 src=tmp/mlffnntrainingSamples.png></td>";
        echo "<td><img name=curimage id=curimage width=600 src=tmp/mlffnntestingSamples.png> </td></tr></table>";
    } else {
        echo '<br><b>Result of pattern classification</b><br>';
        echo implode('', file("tmp/results.txt"));
        //echo nl2br(implode('',file('tmp/results.txt')));
    }
}
?>
