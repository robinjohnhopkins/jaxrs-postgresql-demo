package org.wildfly.s2i.rest;

import java.util.ArrayList;
import java.util.List;

import javax.inject.Inject;
import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;
import javax.transaction.UserTransaction;
import javax.ws.rs.GET;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.core.MediaType;

import org.wildfly.s2i.model.Task;

@Path("rest")
@Produces(MediaType.APPLICATION_JSON)
public class NonDbRest {

    @Path("task")
    @GET
    public Task getATask() {
       Task task = new Task();
       task.setId(11L);
       task.setTitle("my tasky wask");
       return task;
    }

    @GET
    public String getAString() {
        return "boom";
    }

}
