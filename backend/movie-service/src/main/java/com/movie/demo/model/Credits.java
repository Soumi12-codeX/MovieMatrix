package com.movie.demo.model;

import java.util.List;

public class Credits {
    private List<Cast> cast;
    private List<Crew> crew;

    public Credits() {
    }

    public List<Cast> getCast() {
        return cast;
    }

    public void setCast(List<Cast> cast) {
        this.cast = cast;
    }

    public List<Crew> getCrew() {
        return crew;
    }

    public void setCrew(List<Crew> crew) {
        this.crew = crew;
    }
}