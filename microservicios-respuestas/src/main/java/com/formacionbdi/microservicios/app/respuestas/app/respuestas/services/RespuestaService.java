package com.formacionbdi.microservicios.app.respuestas.app.respuestas.services;

import com.formacionbdi.microservicios.app.respuestas.models.entity.Respuesta;

public interface RespuestaService {

	public Iterable<Respuesta> saveAll(Iterable<Respuesta> respuestas);
	
	public Iterable<Respuesta> findRespuestaByAlumnoByExamen(Long alumnoId, Long examenId);
	
	public Iterable<Long> findExamenesIdsRespuestasByAlumno(Long alumnoId);
	
	public Iterable<Respuesta> findByAlumnoId(Long alumnoId);
}
