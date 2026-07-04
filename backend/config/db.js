import postgres from 'postgres';

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  console.warn("⚠️ Warning: DATABASE_URL not found in environment!");
}

const sql = postgres(connectionString);

// Lightweight compatibility layer mapping Supabase JS client syntax to raw Postgres queries
export const supabase = {
  from(tableName) {
    const builder = {
      _select: '*',
      _wheres: [],
      _neqs: [],
      _orderBy: null,
      _limit: null,
      _maybeSingle: false,
      _insertData: null,
      _delete: false,

      select(fields = '*') {
        this._select = fields;
        return this;
      },

      eq(column, value) {
        this._wheres.push({ column, value });
        return this;
      },

      neq(column, value) {
        this._neqs.push({ column, value });
        return this;
      },

      order(column, options = {}) {
        this._orderBy = { column, ascending: options.ascending !== false };
        return this;
      },

      limit(val) {
        this._limit = val;
        return this;
      },

      maybeSingle() {
        this._maybeSingle = true;
        return this;
      },

      insert(data) {
        this._insertData = data;
        return this;
      },

      delete() {
        this._delete = true;
        return this;
      },

      // thenable implementation to execute query when awaited
      async then(resolve, reject) {
        try {
          let data;
          if (this._delete) {
            let queryStr = `DELETE FROM "${tableName}"`;
            const params = [];
            const conditions = [];

            if (this._wheres.length > 0) {
              this._wheres.forEach((w) => {
                params.push(w.value);
                conditions.push(`"${w.column}" = $${params.length}`);
              });
            }

            if (this._neqs.length > 0) {
              this._neqs.forEach((n) => {
                params.push(n.value);
                conditions.push(`"${n.column}" != $${params.length}`);
              });
            }

            if (conditions.length > 0) {
              queryStr += ` WHERE ${conditions.join(' AND ')}`;
            }

            const res = await sql.unsafe(queryStr, params);
            data = res;
          } else if (this._insertData) {
            const rows = Array.isArray(this._insertData) ? this._insertData : [this._insertData];
            if (rows.length === 0) {
              data = [];
            } else {
              const keys = Object.keys(rows[0]);
              const inserted = await sql`
                INSERT INTO ${sql(tableName)} ${sql(rows, keys)}
                RETURNING *
              `;
              data = inserted;
            }
          } else {
            let queryStr = `SELECT ${this._select === '*' ? '*' : this._select} FROM "${tableName}"`;
            const params = [];
            const conditions = [];
            
            if (this._wheres.length > 0) {
              this._wheres.forEach((w) => {
                params.push(w.value);
                conditions.push(`"${w.column}" = $${params.length}`);
              });
            }

            if (this._neqs.length > 0) {
              this._neqs.forEach((n) => {
                params.push(n.value);
                conditions.push(`"${n.column}" != $${params.length}`);
              });
            }

            if (conditions.length > 0) {
              queryStr += ` WHERE ${conditions.join(' AND ')}`;
            }

            if (this._orderBy) {
              queryStr += ` ORDER BY "${this._orderBy.column}" ${this._orderBy.ascending ? 'ASC' : 'DESC'}`;
            }

            if (this._limit !== null) {
              queryStr += ` LIMIT ${this._limit}`;
            }

            const res = await sql.unsafe(queryStr, params);
            data = res;
          }

          if (this._maybeSingle) {
            resolve({ data: data[0] || null, error: null });
          } else {
            resolve({ data, error: null });
          }
        } catch (err) {
          console.error(`Database error on ${tableName}:`, err);
          resolve({ data: null, error: err });
        }
      }
    };
    return builder;
  }
};

export default sql;
