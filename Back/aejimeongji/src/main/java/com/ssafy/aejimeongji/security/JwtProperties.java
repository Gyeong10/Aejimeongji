package com.ssafy.aejimeongji.security;

public interface JwtProperties {
    long accessTokenValidTime = 10 * 60 * 1000L;
    long refreshTokenValidTime = 365 * 24 * 60 * 60 * 1000L;
}