Georgia Disasters Visualization
============

Map visualization based on Georgia disaster data from 2010-2012, specifically showing the frequency of disaster types per county. Based on data from [Emcien's Data Visualization Challenge](https://github.com/emcien/jobs/blob/master/disasters.csv).

## Setup

Clone this repo
```shell
git clone git@github.com:rustybailey/ga-disasters.git
```

Start a local server. Python is shown below, but you can use any local server.

```shell
python -m SimpleHTTPServer 8000
```

Open http://localhost:8000/ga-disasters/

## Resources

- [Mike Bostock's "Let's Make a Map"](http://bost.ocks.org/mike/map/)
- [US Atlas TopoJSON (mbostock/us-atlas)](https://github.com/mbostock/us-atlas) 
- [d3 Geo Projections](https://github.com/mbostock/d3/wiki/Geo-Projections)



### TODO

- Change buttons to a simple dropdown.
- Scale by property damage instead of frequency (change header to reflect this).
- Also break down by year.
- Change colors to green?
- Unify styles/colors.
- Comment code.
- Add spinner for the 2 sec loading time.
- Change color scale from quantize to linear
- Add legend.