package digit;


import org.egov.tracer.config.TracerConfiguration;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.domain.EntityScan;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.context.annotation.Import;
//@Import({ TracerConfiguration.class })
@SpringBootApplication
@ComponentScan(basePackages = { "digit", "digit.web.controllers" , "digit.config"})
//@EnableJpaRepositories(basePackages = "digit.repository")
@EntityScan(basePackages = {"digit.web.models", "digit.bmc.model"})
@Import(TracerConfiguration.class)
public class Main {


    public static void main(String[] args) {
        SpringApplication.run(Main.class, args);
        
    }

}
