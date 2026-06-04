<?php

namespace App\Repositories;

use Illuminate\Database\Eloquent\Collection;
use Illuminate\Database\Eloquent\Model;

interface BaseRepositoryInterface
{
    /**
     * Get all instances of the model.
     *
     * @param array $columns
     * @param array $relations
     * @return Collection
     */
    public function all(array $columns = ['*'], array $relations = []): Collection;

    /**
     * Find a model by its primary key.
     *
     * @param string $id
     * @param array $columns
     * @param array $relations
     * @return Model|null
     */
    public function find(string $id, array $columns = ['*'], array $relations = []): ?Model;

    /**
     * Find a model by its primary key or throw an exception.
     *
     * @param string $id
     * @param array $columns
     * @param array $relations
     * @return Model
     *
     * @throws \Illuminate\Database\Eloquent\ModelNotFoundException
     */
    public function findOrFail(string $id, array $columns = ['*'], array $relations = []): Model;

    /**
     * Create a new record in the database.
     *
     * @param array $attributes
     * @return Model
     */
    public function create(array $attributes): Model;

    /**
     * Update an existing record in the database.
     *
     * @param string $id
     * @param array $attributes
     * @return bool
     */
    public function update(string $id, array $attributes): bool;

    /**
     * Delete a record by its primary key.
     *
     * @param string $id
     * @return bool
     */
    public function delete(string $id): bool;
}
