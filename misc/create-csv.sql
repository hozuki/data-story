SELECT country, code,
    bmi25 AS 'Mean of crude est. all genders BMI > 25, year 2010', bmi30 AS 'Mean of crude est. all genders BMI > 30, year 2010',
    phy_act AS 'Mean of crude est. all genders insufficient physical activity, year 2010',
    alcohol AS 'Value of alcohol consumption, all types, year 2010, in litres of pure alcohol',
    t15m AS 'Mean of crude est. male smoking prevalence, year 2010', t15f AS 'Mean of crude est. female smoking prevalence, year 2010',
    inf1 AS 'Density per 1M population: health posts, year 2010', inf2 AS 'Density per 1M population: health centres, year 2010',
    inf3 AS 'Density per 1M population: district/rural hospitals, year 2010', inf4 AS 'Density per 1M population: provincial hospitals, year 2010',
    inf5 AS 'Density per 1M population: specialized hospitals, year 2010',
    cont
FROM
    country_code AS t0
    LEFT JOIN
        (SELECT country_code.country AS c, bmi25.mean AS bmi25 FROM country_code, bmi25 WHERE bmi25.gender = 0 AND bmi25.year = 2010 AND bmi25.country = country_code.country) AS t1
        ON t0.country = t1.c
    LEFT JOIN
        (SELECT country_code.country AS c, bmi30.mean AS bmi30 FROM country_code, bmi30 WHERE bmi30.gender = 0 AND bmi30.year = 2010 AND bmi30.country = country_code.country) AS t2
        ON t0.country = t2.c
    LEFT JOIN
        (SELECT country_code.country AS c, phy_act.mean AS phy_act FROM country_code, phy_act WHERE phy_act.gender = 0 AND phy_act.year = 2010 AND phy_act.country = country_code.country) AS t3
        ON t0.country = t3.c
    LEFT JOIN
        (SELECT country_code.country AS c, alcohol.value AS alcohol FROM country_code, alcohol WHERE alcohol.type = 'All types' AND alcohol.year = 2010 AND alcohol.country = country_code.country) AS t4
        ON t0.country = t4.c
    LEFT JOIN
        (SELECT country_code.country AS c, t15.mean AS t15m FROM country_code, t15 WHERE t15.gender = 2 AND t15.year = 2010 AND t15.country = country_code.country) AS t5
        ON t0.country = t5.c
    LEFT JOIN
        (SELECT country_code.country AS c, t15.mean AS t15f FROM country_code, t15 WHERE t15.gender = 1 AND t15.year = 2010 AND t15.country = country_code.country) AS t6
        ON t0.country = t6.c
    -- LEFT JOIN
    --    (SELECT country_code.country AS c, health_inf.value AS inf0 FROM country_code, health_inf WHERE health_inf.type = 0 AND health_inf.year = 2010 AND health_inf.country = country_code.country) AS t7
    --    ON t0.country = t7.c
    LEFT JOIN
        (SELECT country_code.country AS c, health_inf.value AS inf1 FROM country_code, health_inf WHERE health_inf.type = 1 AND health_inf.year = 2010 AND health_inf.country = country_code.country) AS t8
        ON t0.country = t8.c
    LEFT JOIN
        (SELECT country_code.country AS c, health_inf.value AS inf2 FROM country_code, health_inf WHERE health_inf.type = 2 AND health_inf.year = 2010 AND health_inf.country = country_code.country) AS t9
        ON t0.country = t9.c
    LEFT JOIN
        (SELECT country_code.country AS c, health_inf.value AS inf3 FROM country_code, health_inf WHERE health_inf.type = 3 AND health_inf.year = 2010 AND health_inf.country = country_code.country) AS t10
        ON t0.country = t10.c
    LEFT JOIN
        (SELECT country_code.country AS c, health_inf.value AS inf4 FROM country_code, health_inf WHERE health_inf.type = 4 AND health_inf.year = 2010 AND health_inf.country = country_code.country) AS t11
        ON t0.country = t11.c
    LEFT JOIN
        (SELECT country_code.country AS c, health_inf.value AS inf5 FROM country_code, health_inf WHERE health_inf.type = 5 AND health_inf.year = 2010 AND health_inf.country = country_code.country) AS t12
        ON t0.country = t12.c
    LEFT JOIN
        (SELECT country_code.country AS c, continents.cont AS cont FROM country_code, continents WHERE continents.country = country_code.country) AS t13
        ON t0.country = t13.c
;