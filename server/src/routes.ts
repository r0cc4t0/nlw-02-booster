import express from 'express';
import db from './database/connection';
import convertHoursToMinutes from './utils/convertHoursToMinutes';

const routes = express.Router();

interface ScheduleItem {
  week_day: number;
  from: string;
  to: string;
};

routes.post('/classes', async (request, response) => {
  const {
    name, avatar, whatsapp, bio, subject, cost, schedule
  } = request.body;

  const trx = await db.transaction();

  try {
    const insertedUsersIDs = await trx('users').insert({
      name, avatar, whatsapp, bio
    });

    const user_id = insertedUsersIDs[0];

    const insertedClassesIDs = await trx('classes').insert({
      subject, cost, user_id
    });

    const class_id = insertedClassesIDs[0];

    const classSchedules = schedule.map((scheduleItem: ScheduleItem) => {
      return {
        week_day: scheduleItem.week_day,
        from: convertHoursToMinutes(scheduleItem.from),
        to: convertHoursToMinutes(scheduleItem.to),
        class_id
      };
    });

    await trx('class_schedules').insert(classSchedules);

    await trx.commit();

    return response.status(201).send();
  }
  catch (error) {
    await trx.rollback();

    return response.status(400).json({
      error: 'Unexpected error while creating new class.'
    });
  }
});

export default routes;
