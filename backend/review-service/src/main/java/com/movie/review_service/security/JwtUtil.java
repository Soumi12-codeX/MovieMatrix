package com.movie.review_service.security;

import java.nio.charset.StandardCharsets;
import java.security.Key;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;

@Component
public class JwtUtil {
    
    @Value("${jwt.secret}")
    private String secret;

    private Key getKey(){
        return Keys.hmacShaKeyFor(secret.getBytes(StandardCharsets.UTF_8));
    }

    public String extractUsername(String token){
        return Jwts.parserBuilder()
                .setSigningKey(getKey())
                .build()
                .parseClaimsJws(token)
                .getBody()
                .getSubject();
    }

    public boolean validateToken(String token, String username){
        try{
            String tokenUsername =  extractUsername(token);
            return tokenUsername.equals(username);
        } catch (Exception e) {
            return false;
        }
    }

    public String extractUsernameUnchecked(String token){
        try{
            return extractUsername(token);
        }
        catch(Exception e){
            return null;
        }
    }
}
