Georgia Disasters Visualization
============

Map visualization based on Georgia disaster data from 2010-2012, specifically showing the frequency of disaster types per county. Based on data from [Emcien's](https://github.com/emcien) [Data Visualization Challenge](https://github.com/emcien/jobs).

Check it out here: [http://rustybailey.github.io/ga-disasters/](http://rustybailey.github.io/ga-disasters/)

## Local Setup

Clone this repo
```shell
git clone git@github.com:rustybailey/ga-disasters.git
```

Start a local server. Python is shown below, but you can use any simple local server.

```shell
python -m SimpleHTTPServer 8000
```

Open [http://localhost:8000/ga-disasters/](http://localhost:8000/ga-disasters/)

## Resources

- [Mike Bostock's "Let's Make a Map"](http://bost.ocks.org/mike/map/)
- [US Atlas TopoJSON (mbostock/us-atlas)](https://github.com/mbostock/us-atlas) 
- [d3 Geo Projections](https://github.com/mbostock/d3/wiki/Geo-Projections)

---------------------------------------

##### TODO & Future Ideas:

- Scale by property damage instead of frequency (change header to reflect this).
- Also filter by year.
- If only one county is highlighted, show darker color.
- Change colors to green?
- Add spinner for the 2 sec loading time.
- Sparklines by disaster type showing disaster trending over time.


