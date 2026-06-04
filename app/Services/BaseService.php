<?php

namespace App\Services;

use App\Repositories\BaseRepositoryInterface;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Database\Eloquent\Model;

abstract class BaseService
{
    /**
     * The primary repository instance.
     *
     * @var BaseRepositoryInterface
     */
    protected BaseRepositoryInterface $repository;

    /**
     * BaseService constructor.
     *
     * @param BaseRepositoryInterface $repository
     */
    public function __construct(BaseRepositoryInterface $repository)
    {
        $this->repository = $repository;
    }

    /**
     * Get all instances from the repository.
     */
    public function all(array $columns = ['*'], array $relations = []): Collection
    {
        return $this->repository->all($columns, $relations);
    }

    /**
     * Find an instance by its primary key.
     */
    public function find(string $id, array $columns = ['*'], array $relations = []): ?Model
    {
        return $this->repository->find($id, $columns, $relations);
    }

    /**
     * Find an instance by its primary key or throw an exception.
     */
    public function findOrFail(string $id, array $columns = ['*'], array $relations = []): Model
    {
        return $this->repository->findOrFail($id, $columns, $relations);
    }

    /**
     * Create a new instance.
     */
    public function create(array $attributes): Model
    {
        return $this->repository->create($attributes);
    }

    /**
     * Update an existing instance.
     */
    public function update(string $id, array $attributes): bool
    {
        return $this->repository->update($id, $attributes);
    }

    /**
     * Delete an instance by its primary key.
     */
    public function delete(string $id): bool
    {
        return $this->repository->delete($id);
    }
}
