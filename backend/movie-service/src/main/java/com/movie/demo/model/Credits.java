package com.movie.demo.model;

import java.util.List;

public class Credits {
    private List<Cast> cast;
    public Credits() {
    }
    public List<Cast> getCast() {
        return cast;
    }
    public void setCast(List<Cast> cast) {
        this.cast = cast;
    }
}
